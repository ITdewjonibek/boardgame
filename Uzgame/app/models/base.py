from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Text, JSON, DateTime, Float, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from app.database import Base

class UserRole(str, enum.Enum):
    STUDENT = "student"
    TEACHER = "teacher"

class GameType(str, enum.Enum):
    PRO = "pro"
    SUBJECT = "subject"

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(20), default="student") # "student" | "teacher"
    created_at = Column(DateTime, default=datetime.utcnow)

    sets = relationship("TestSet", back_populates="owner")
    scores = relationship("Score", back_populates="user")

class Game(Base):
    __tablename__ = "games"
    id = Column(Integer, primary_key=True, index=True)
    key = Column(String(100), unique=True, index=True, nullable=False)
    title = Column(String(255), nullable=False)
    section = Column(String(20), default="pro") # "pro" | "subject"
    icon_key = Column(String(100))
    difficulty = Column(String(20)) # "Oson", "O'rta", "Qiyin", "Expert"

    sets = relationship("TestSet", back_populates="game")
    scores = relationship("Score", back_populates="game")

class TestSet(Base):
    __tablename__ = "gt_sets"
    id = Column(Integer, primary_key=True, index=True)
    game_id = Column(Integer, ForeignKey("games.id"), nullable=False)
    owner_teacher_id = Column(Integer, ForeignKey("users.id"), nullable=True) # NULL for default sets
    name = Column(String(255), nullable=False) # "default", "test-1", etc.
    created_at = Column(DateTime, default=datetime.utcnow)

    game = relationship("Game", back_populates="sets")
    owner = relationship("User", back_populates="sets")
    questions = relationship("Question", back_populates="set", cascade="all, delete-orphan")

class Question(Base):
    __tablename__ = "gt_questions"
    id = Column(Integer, primary_key=True, index=True)
    set_id = Column(Integer, ForeignKey("gt_sets.id"), nullable=False)
    prompt = Column(Text, nullable=False)
    explanation = Column(Text)
    qhash = Column(String(64), unique=True, index=True, nullable=False)

    set = relationship("TestSet", back_populates="questions")
    options = relationship("Option", back_populates="question", cascade="all, delete-orphan")

class Option(Base):
    __tablename__ = "gt_options"
    id = Column(Integer, primary_key=True, index=True)
    question_id = Column(Integer, ForeignKey("gt_questions.id"), nullable=False)
    text = Column(String(255), nullable=False)
    is_correct = Column(Boolean, default=False)

    question = relationship("Question", back_populates="options")

class Score(Base):
    __tablename__ = "scores"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    game_id = Column(Integer, ForeignKey("games.id"), nullable=False)
    room_id = Column(Integer, ForeignKey("multiplayer_rooms.id"), nullable=True)
    score = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="scores")
    game = relationship("Game", back_populates="scores")

class MultiplayerRoom(Base):
    __tablename__ = "multiplayer_rooms"
    id = Column(Integer, primary_key=True, index=True)
    room_code = Column(String(10), unique=True, index=True, nullable=False)
    game_id = Column(Integer, ForeignKey("games.id"), nullable=False)
    status = Column(String(20), default="waiting") # "waiting", "playing", "finished"
    created_at = Column(DateTime, default=datetime.utcnow)
