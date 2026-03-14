import os
import sys
from pathlib import Path
from sqlalchemy import create_engine
from dotenv import load_dotenv

# Path to the backend directory
BACKEND_PATH = r"C:\my-project-breakfast-figma\Totcbecend"
sys.path.append(BACKEND_PATH)

# Load env from the backend
load_dotenv(os.path.join(BACKEND_PATH, ".env"))

# Import models from the backend
try:
    from app.database import engine, Base
    import app.models # This should register the models
    
    print(f"Creating tables in: {engine.url}")
    Base.metadata.create_all(bind=engine)
    print("SUCCESS: Tables created or already exist.")
    
except Exception as e:
    print(f"FAILED to create tables: {e}")
    # Fallback: Manual creation if imports fail
    print("Trying fallback manual creation...")
    DATABASE_URL = os.getenv("DATABASE_URL")
    if not DATABASE_URL:
        # Construct from components
        DB_HOST = os.getenv("DB_HOST", "localhost")
        DB_PORT = os.getenv("DB_PORT", "5432")
        DB_USER = os.getenv("DB_USER", "postgres")
        DB_PASS = os.getenv("DB_PASS", "jonibek")
        DB_NAME = os.getenv("DB_NAME", "mening_loyiha_db")
        DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASS}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
    
    try:
        engine_fb = create_engine(DATABASE_URL)
        from sqlalchemy import Column, Integer, String, Text, ForeignKey, Float
        from sqlalchemy.orm import relationship, declarative_base
        
        BaseFB = declarative_base()
        
        class Test(BaseFB):
            __tablename__ = "test"
            id = Column(Integer, primary_key=True)
            game_key = Column(String)
            title = Column(String)
            teacher_name = Column(String)

        class Question(BaseFB):
            __tablename__ = "questions"
            id = Column(Integer, primary_key=True)
            test_id = Column(Integer, ForeignKey("test.id"))
            text = Column(Text)
            correct_option = Column(Integer)
            explanation = Column(Text)
            difficulty = Column(String)

        class Option(BaseFB):
            __tablename__ = "options"
            id = Column(Integer, primary_key=True)
            question_id = Column(Integer, ForeignKey("questions.id"))
            text = Column(String)

        BaseFB.metadata.create_all(bind=engine_fb)
        print("SUCCESS: Tables created via fallback!")
    except Exception as e2:
        print(f"Manual fallback also FAILED: {e2}")
