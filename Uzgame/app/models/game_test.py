import hashlib
import re
from datetime import datetime

from sqlalchemy import Column, Integer, String, ForeignKey, Text, DateTime, Boolean, UniqueConstraint, Index
from sqlalchemy.orm import relationship

from app.database import Base


def normalize_text(s: str) -> str:
    s = (s or "").strip().lower()
    s = re.sub(r"\s+", " ", s)
    return s


def question_hash(prompt: str, options: list[str]) -> str:
    base = normalize_text(prompt) + "|" + "|".join(normalize_text(o) for o in options)
    return hashlib.sha256(base.encode("utf-8")).hexdigest()


class GameTestSet(Base):
    __tablename__ = "game_test_sets"

    id = Column(Integer, primary_key=True, index=True)
    game_key = Column(String(50), index=True)  # e.g. quiz, chemistry, physics...
    title = Column(String(200), index=True)

    # NULL means "default set" seeded by the system
    teacher_id = Column(Integer, ForeignKey("users.id"), index=True, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Mark if this is the default seeded set
    is_default = Column(Boolean, default=False, nullable=False)

    # free limit: 2 sets per (teacher, game_key). If teacher buys, set this True.
    is_premium = Column(Boolean, default=False)

    questions = relationship("GameTestQuestion", back_populates="test_set", cascade="all, delete-orphan")

    __table_args__ = (
        Index("ix_game_test_sets_teacher_game", "teacher_id", "game_key"),
    )


class GameTestQuestion(Base):
    __tablename__ = "game_test_questions"

    id = Column(Integer, primary_key=True, index=True)
    test_set_id = Column(Integer, ForeignKey("game_test_sets.id"), index=True)

    prompt = Column(Text)
    correct_index = Column(Integer)  # 0..3
    
    # AAA specific additions for V5
    explanation = Column(Text, default="No explanation provided")
    difficulty = Column(String(50), default="medium") # easy, medium, hard

    # Prevent duplicates globally (prompt + all options)
    qhash = Column(String(64), unique=True, index=True)

    test_set = relationship("GameTestSet", back_populates="questions")
    options = relationship("GameOption", back_populates="question", cascade="all, delete-orphan")


class GameOption(Base):
    __tablename__ = "game_options"

    id = Column(Integer, primary_key=True, index=True)
    question_id = Column(Integer, ForeignKey("game_test_questions.id"), index=True)
    text = Column(Text)

    question = relationship("GameTestQuestion", back_populates="options")
