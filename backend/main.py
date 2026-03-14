from sqlalchemy import text
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import engine, Base
from routers import auth, games, sections, tests, game_tests

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Vite Project API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, tags=["auth"])
app.include_router(games.router, prefix="/games", tags=["games"])
app.include_router(sections.router, prefix="/sections", tags=["sections"])
app.include_router(tests.router, prefix="/tests", tags=["tests"])
app.include_router(game_tests.router, tags=["game-tests"])


@app.get("/")
def root():
    return {"message": "Interaktiv-ta'lim API", "version": "1.0"}


@app.get("/health")
def health():
    """Frontend backend holatini tekshirish uchun"""
    try:
        from database import engine
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        return {"status": "ok", "database": "connected"}
    except Exception:
        return {"status": "ok", "database": "disconnected"}
