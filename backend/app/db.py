import os
from pathlib import Path

from sqlalchemy import create_engine, event
from sqlalchemy.orm import declarative_base, sessionmaker

SQLITE_DB_PATH = Path(__file__).resolve().parents[1] / "sql_app.db"
DEFAULT_SQLITE_URL = f"sqlite:///{SQLITE_DB_PATH}"
DATABASE_URL = os.getenv("DATABASE_URL", DEFAULT_SQLITE_URL)

if DATABASE_URL.startswith("sqlite"):
    engine = create_engine(
        DATABASE_URL,
        connect_args={"check_same_thread": False, "timeout": 30},
    )
else:
    # DEBUG: Log which user we are connecting with (useful for Vercel troubleshooting)
    try:
        debug_user = DATABASE_URL.split("://")[1].split(":")[0]
        print(f"DATABASE DEBUG: Attempting to connect as user '{debug_user}'")
    except Exception:
        print("DATABASE DEBUG: Could not parse DATABASE_URL for logging")
        
    engine = create_engine(DATABASE_URL)


if DATABASE_URL.startswith("sqlite"):
    @event.listens_for(engine, "connect")
    def set_sqlite_pragma(dbapi_connection, connection_record):
        cursor = dbapi_connection.cursor()
        cursor.execute("PRAGMA journal_mode=WAL")
        cursor.execute("PRAGMA synchronous=NORMAL")
        cursor.close()


SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
