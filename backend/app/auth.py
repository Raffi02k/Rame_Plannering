from datetime import datetime, timedelta
from typing import Optional
import uuid
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from . import models, db

# Secret key for prototype (in production this should be in env)
SECRET_KEY = "supersecretkey"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 3000

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

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

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(db.get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    username: Optional[str] = None
    name: Optional[str] = None
    iss: Optional[str] = None

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
    except JWTError:
        try:
            unverified = jwt.get_unverified_claims(token)
            username = (
                unverified.get("preferred_username")
                or unverified.get("email")
                or unverified.get("upn")
            )
            name = unverified.get("name")
            iss = unverified.get("iss")
        except JWTError:
            raise credentials_exception

    if not username:
        raise credentials_exception

    user = db.query(models.User).filter(models.User.username == username).first()
    if user is None:
        is_oidc = iss and "login.microsoftonline.com" in iss
        if not is_oidc:
            raise credentials_exception

        override = OIDC_USER_OVERRIDES.get(username.lower())
        if not override:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="OIDC user not provisioned",
            )

        user = models.User(
            id=f"oidc-{uuid.uuid4().hex[:8]}",
            username=username,
            hashed_password=get_password_hash(uuid.uuid4().hex),
            name=override.get("name") or name or username,
            avatar=f"https://api.dicebear.com/7.x/avataaars/svg?seed={username}",
            role=override.get("role", "staff"),
            unit_id=override.get("unit_id"),
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    return user
