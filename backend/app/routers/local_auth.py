from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from .. import models, schemas, db
from ..auth import local_jwt

router = APIRouter(tags=["local-auth"])


@router.post("/token", response_model=schemas.Token)
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db_session: Session = Depends(db.get_db),
):
    user = db_session.query(models.User).filter(models.User.username == form_data.username).first()
    if not user or not local_jwt.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = local_jwt.create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/me", response_model=schemas.User)
def get_me(current_user: models.User = Depends(local_jwt.get_current_user)):
    return current_user
