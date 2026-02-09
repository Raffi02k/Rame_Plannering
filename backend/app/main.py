from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import local_auth, oidc_auth, api_router
from . import models, db, seed

# Create tables
models.Base.metadata.create_all(bind=db.engine)

app = FastAPI()

# CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all for prototype
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(local_auth.router)
app.include_router(oidc_auth.router)
app.include_router(api_router.router)

@app.on_event("startup")
def seed_on_startup():
    seed.seed_data()

@app.get("/")
def read_root():
    return {"message": "Autopilot Planner API"}
