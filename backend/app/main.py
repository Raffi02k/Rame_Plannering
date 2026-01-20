from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from . import models, db, routes

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

app.include_router(routes.router)

@app.get("/")
def read_root():
    return {"message": "Autopilot Planner API"}
