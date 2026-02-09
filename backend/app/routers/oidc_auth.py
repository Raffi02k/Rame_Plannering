from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from .. import models, db
from ..auth import oidc

router = APIRouter(prefix="/oidc", tags=["oidc-auth"])
oidc_scheme = OAuth2PasswordBearer(tokenUrl="token")


def get_oidc_claims(token: str = Depends(oidc_scheme)) -> dict:
    try:
        return oidc.validate_oidc_token(token)
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=f"Invalid OIDC token: {exc}")


def require_oidc_access(claims: dict = Depends(get_oidc_claims)) -> dict:
    oidc.require_oidc_scopes(claims, oidc.get_required_scopes())
    return claims


def get_current_user_oidc(
    claims: dict = Depends(get_oidc_claims),
    db_session: Session = Depends(db.get_db),
) -> models.User:
    return oidc.get_or_create_oidc_user(db_session, claims)


@router.get("/me")
def me_oidc(
    current_user: models.User = Depends(get_current_user_oidc),
    _claims: dict = Depends(require_oidc_access),
):
    return {
        "id": current_user.id,
        "username": current_user.username,
        "name": current_user.name,
        "role": current_user.role,
        "unit_id": current_user.unit_id,
        "auth_method": current_user.auth_method,
    }
