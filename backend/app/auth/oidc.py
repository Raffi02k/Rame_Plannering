import logging
import os
import time
import uuid
from typing import Optional, cast
import requests
from dotenv import load_dotenv
from fastapi import HTTPException, status
from jose import JWTError, jwt
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from .. import models
from .local_jwt import get_password_hash

load_dotenv()

# Configuration
OIDC_ISSUER = os.getenv("OIDC_ISSUER")  # Comma-separated issuers allowed
OIDC_AUDIENCE = os.getenv("OIDC_AUDIENCE")  # API App ID URI or client id
OIDC_JWKS_URL = os.getenv("OIDC_JWKS_URL")  # Entra JWKS endpoint
OIDC_REQUIRED_SCOPES = os.getenv("OIDC_REQUIRED_SCOPES")
OIDC_JWKS_CACHE_TTL_SECONDS = os.getenv("OIDC_JWKS_CACHE_TTL_SECONDS", "3600")

logger = logging.getLogger(__name__)
_jwks_cache: dict[str, object] = {}


OIDC_USER_OVERRIDES = {
    "rafmed002@trollhattan.se": {
        "role": "admin",
        "unit_id": "u3",
        "name": "Raffi Medzad Aghlian",
    },
    "rafmed001@trollhattan.se": {
        "role": "staff",
        "unit_id": "u3",
        "name": "Raffi Medzad Aghlian",
    },
    "jajn@trollhattan.se": {
        "role": "staff",
        "unit_id": "u3",
        "name": "Johanna Nyman",
    },
}


def _parse_csv_env(value: str | None) -> list[str]:
    if not value:
        return []
    return [item.strip() for item in value.split(",") if item.strip()]


def _get_jwks() -> dict:
    now = time.time()
    cached = _jwks_cache.get("jwks")
    expires_at = _jwks_cache.get("expires_at")
    if cached and isinstance(expires_at, (int, float)) and now < expires_at:
        return cast(dict, cached)

    try:
        response = requests.get(cast(str, OIDC_JWKS_URL), timeout=5)
        response.raise_for_status()
        jwks = response.json()
        ttl_seconds = int(OIDC_JWKS_CACHE_TTL_SECONDS)
        _jwks_cache["jwks"] = jwks
        _jwks_cache["expires_at"] = now + max(ttl_seconds, 60)
        return jwks
    except Exception as exc:
        if cached:
            logger.warning("JWKS fetch failed; using cached JWKS", exc_info=exc)
            return cast(dict, cached)
        raise


def validate_oidc_token(token: str) -> dict:
    # 0) Måste ha config
    if not (OIDC_ISSUER and OIDC_AUDIENCE and OIDC_JWKS_URL):
        raise RuntimeError("Missing OIDC config")

    # 1) Läs header för att hitta kid (vilken nyckel som används)
    header = jwt.get_unverified_header(token)
    kid = header.get("kid")
    if not kid:
        raise JWTError("Missing kid")

    # 2) Hämta JWKS (publika nycklar) från Entra
    jwks = _get_jwks()

    # 3) Leta upp rätt key baserat på kid
    matched_key = None
    for jwk in jwks.get("keys", []):
        if jwk.get("kid") == kid:
            matched_key = jwk
            break
    if not matched_key:
        raise JWTError("No matching key found")

    # 4) Validate access token for this API
    claims = jwt.decode(
        token,
        matched_key,
        algorithms=["RS256"],
        audience=cast(str, OIDC_AUDIENCE),
        options={"verify_iss": False},
    )

    allowed_issuers = _parse_csv_env(OIDC_ISSUER)
    if allowed_issuers:
        token_issuer = claims.get("iss")
        if token_issuer not in allowed_issuers:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid issuer")

    return claims


def validate_oidc_token_minimal(token: str) -> dict:
    if token.count(".") != 2:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not a JWT")

    claims = jwt.get_unverified_claims(token)

    if "exp" not in claims:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing exp")

    return claims


def first_non_empty_string(claims: dict, possible_keys: list[str]) -> str | None:
    """
    Returnerar första icke-tomma strängen i `claims` för någon av nycklarna i `possible_keys`.
    Trim:ar whitespace. Returnerar None om inget matchar.
    """
    for key in possible_keys:
        value = claims.get(key)
        if isinstance(value, str) and value.strip():
            return value.strip()
    return None


def get_or_create_oidc_user(db_session: Session, token_claims: dict) -> "models.User":
    # 1) Stabilt OIDC-id: oid (Entra Object ID), annars sub
    oidc_object_id = first_non_empty_string(token_claims, ["oid", "sub"])
    if not oidc_object_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token missing oid/sub")

    # Om man vill kunna stödja fler tenants i framtiden
    tenant_id = first_non_empty_string(token_claims, ["tid"])
    email_address = first_non_empty_string(token_claims, ["preferred_username", "email", "upn"])
    display_name = first_non_empty_string(token_claims, ["name", "preferred_username"])
    username = (email_address or oidc_object_id).strip().lower()
    override = OIDC_USER_OVERRIDES.get(username)

    # 2) Finns redan användare länkad via oidc_id?
    existing_user_by_oidc = (
        db_session.query(models.User)
        .filter(models.User.oidc_id == oidc_object_id)
        .first()
    )
    if existing_user_by_oidc:
        if getattr(existing_user_by_oidc, "is_disabled", False):
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="User is disabled")
        
        # [FIX] If existing user has no unit, assign to Unit 3
        # Use a nested try/except to handle concurrent update collisions gracefully
        if not existing_user_by_oidc.unit_id:
            try:
                existing_user_by_oidc.unit_id = "u3"
                db_session.commit()
                db_session.refresh(existing_user_by_oidc)
            except Exception as e:
                db_session.rollback()
                # If it fails, likely another concurrent request already fixed it.
                # Just refresh and continue.
                db_session.refresh(existing_user_by_oidc)
            
        return existing_user_by_oidc

    # 2b) Om användaren finns via email/UPN men saknar OIDC-länk, länka den
    # Säkerhetskrav: email måste matcha och tenant_id måste matcha (om den finns i DB)
    if email_address:
        existing_user_by_email_only = (
            db_session.query(models.User)
            .filter(models.User.email == email_address)
            .first()
        )
        if existing_user_by_email_only is not None and not getattr(existing_user_by_email_only, "oidc_id", None):
            if getattr(existing_user_by_email_only, "is_disabled", False):
                raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="User is disabled")
            existing_tenant_id = getattr(existing_user_by_email_only, "oidc_tenant_id", None)
            if existing_tenant_id and tenant_id and existing_tenant_id != tenant_id:
                raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Tenant mismatch")
            setattr(existing_user_by_email_only, "oidc_id", oidc_object_id)
            setattr(existing_user_by_email_only, "auth_method", "oidc")
            setattr(existing_user_by_email_only, "oidc_tenant_id", tenant_id)
            if override:
                setattr(existing_user_by_email_only, "role", override.get("role", existing_user_by_email_only.role))
                setattr(existing_user_by_email_only, "unit_id", override.get("unit_id", existing_user_by_email_only.unit_id))
                if override.get("name"):
                    setattr(existing_user_by_email_only, "name", override.get("name"))
            db_session.commit()
            db_session.refresh(existing_user_by_email_only)
            return existing_user_by_email_only

    # 3) Försök matcha/länka via email
    if email_address:
        existing_user_by_email = (
            db_session.query(models.User)
            .filter(models.User.email == email_address)
            .first()
        )
        if existing_user_by_email is not None:
            if getattr(existing_user_by_email, "is_disabled", False):
                raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="User is disabled")
            # Skydd: samma email får inte redan vara länkad till en annan OIDC-id
            existing_oidc_id = cast(Optional[str], existing_user_by_email.oidc_id)
            if existing_oidc_id is not None and existing_oidc_id != oidc_object_id:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Email already linked to another OIDC user",
                )
            # Länka kontot
            # Use try-except to handle concurrent linking attempt
            try:
                existing_user_by_email.oidc_id = oidc_object_id
                existing_user_by_email.auth_method = "oidc"
                existing_user_by_email.oidc_tenant_id = tenant_id
                if override:
                    existing_user_by_email.role = override.get("role", existing_user_by_email.role)
                    existing_user_by_email.unit_id = override.get("unit_id", existing_user_by_email.unit_id)
                    if override.get("name"):
                        existing_user_by_email.name = override.get("name")
                db_session.commit()
                db_session.refresh(existing_user_by_email)
            except Exception as e:
                db_session.rollback()
                db_session.refresh(existing_user_by_email) # Refresh to get the latest state after rollback
                
            return existing_user_by_email

    # 3b) Om användaren finns via username men saknar OIDC-länk, länka den
    existing_user_by_username = (
        db_session.query(models.User)
        .filter(models.User.username == username)
        .first()
    )
    if existing_user_by_username is not None:
        if getattr(existing_user_by_username, "is_disabled", False):
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="User is disabled")
        existing_oidc_id = cast(Optional[str], existing_user_by_username.oidc_id)
        if existing_oidc_id is not None and existing_oidc_id != oidc_object_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Username already linked to another OIDC user",
            )
        try:
            existing_user_by_username.oidc_id = oidc_object_id
            existing_user_by_username.auth_method = "oidc"
            existing_user_by_username.oidc_tenant_id = tenant_id
            if override:
                existing_user_by_username.role = override.get("role", existing_user_by_username.role)
                existing_user_by_username.unit_id = override.get("unit_id", existing_user_by_username.unit_id)
                if override.get("name"):
                    existing_user_by_username.name = override.get("name")
            db_session.commit()
            db_session.refresh(existing_user_by_username)
        except Exception as e:
            db_session.rollback()
            db_session.refresh(existing_user_by_username)
        return existing_user_by_username

    # 4) Skapa ny användare
    created_user = models.User(
        id=f"oidc-{uuid.uuid4().hex[:8]}",
        username=username,
        email=email_address,
        full_name=display_name,
        name=(override.get("name") if override and override.get("name") else (display_name or username)),
        hashed_password=get_password_hash(uuid.uuid4().hex),
        avatar=f"https://api.dicebear.com/7.x/avataaars/svg?seed={username}",
        role=(override.get("role") if override else "staff"),
        auth_method="oidc",
        oidc_id=oidc_object_id,
        oidc_tenant_id=tenant_id,
        unit_id=(override.get("unit_id") if override else "u3"),
    )

    db_session.add(created_user)
    try:
        db_session.commit()
        db_session.refresh(created_user)
    except IntegrityError as e:
        db_session.rollback()
        existing_user_after_collision = (
            db_session.query(models.User)
            .filter(models.User.username == username)
            .first()
        )
        if existing_user_after_collision is None and email_address:
            existing_user_after_collision = (
                db_session.query(models.User)
                .filter(models.User.email == email_address)
                .first()
            )
        if existing_user_after_collision is not None:
            return existing_user_after_collision
        raise
    return created_user


def require_oidc_scopes(claims: dict, required_scopes: list[str] | None) -> None:
    # Entra scopes are space-delimited in the "scp" claim
    scopes = claims.get("scp") or ""
    scope_list = scopes.split(" ") if isinstance(scopes, str) else []

    if required_scopes and not any(scope in scope_list for scope in required_scopes):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Missing required scope")


def get_required_scopes() -> list[str]:
    return _parse_csv_env(OIDC_REQUIRED_SCOPES)
