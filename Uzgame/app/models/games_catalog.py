from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime
from datetime import datetime
from app.database import Base

class GameCatalog(Base):
    """Unified games catalog - PRO games va SUBJECT modules"""
    __tablename__ = "game_catalog"

    id = Column(Integer, primary_key=True, index=True)
    key = Column(String, unique=True, index=True)  # "logic-grid", "math-algebra", etc
    title = Column(String, index=True)
    description = Column(Text, nullable=True)
    icon = Column(String, nullable=True)  # lucide-react icon name
    difficulty = Column(String, nullable=True)  # "Easy", "Medium", "Hard"
    section = Column(String, index=True)  # "pro" yoki "subject"
    category = Column(String, nullable=True)  # "Puzzle", "Math", "Physics" etc
    estimated_time = Column(Integer, nullable=True)  # minutes
    
    # Gameplay info
    supports_solo = Column(Boolean, default=True)
    supports_team = Column(Boolean, default=True)
    max_questions = Column(Integer, default=20)
    
    # Meta
    is_default = Column(Boolean, default=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
