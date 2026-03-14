from sqlalchemy import Column, Integer, String, ForeignKey, Text, DateTime, Enum
from sqlalchemy.orm import relationship
from app.database import Base
from datetime import datetime
import enum

class DifficultyEnum(str, enum.Enum):
    easy = "easy"
    medium = "medium"
    hard = "hard"

class Subject(Base):
    __tablename__ = "subjects"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    tests = relationship("Test", back_populates="subject")
    sections = relationship("Section", back_populates="subject")

class Section(Base):
    __tablename__ = "sections"
    id = Column(Integer, primary_key=True, index=True)
    subject_id = Column(Integer, ForeignKey("subjects.id"), index=True)
    teacher_name = Column(String, index=True)
    title = Column(String, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    tests = relationship("Test", back_populates="section", cascade="all, delete-orphan")
    subject = relationship("Subject", back_populates="sections")

class Test(Base):
    __tablename__ = "tests"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    game_key = Column(String, index=True, nullable=True) # Mapping to specific games
    subject_id = Column(Integer, ForeignKey("subjects.id"))
    section_id = Column(Integer, ForeignKey("sections.id"), nullable=True)
    teacher_name = Column(String)
    difficulty = Column(Enum(DifficultyEnum), default=DifficultyEnum.medium)
    questions = relationship("Question", back_populates="test", cascade="all, delete-orphan")
    subject = relationship("Subject", back_populates="tests")
    section = relationship("Section", back_populates="tests")

class Question(Base):
    __tablename__ = "questions"
    id = Column(Integer, primary_key=True, index=True)
    text = Column(Text)
    test_id = Column(Integer, ForeignKey("tests.id"))
    options = relationship("Option", back_populates="question", cascade="all, delete-orphan")
    correct_option = Column(Integer)  # index of correct option (0,1,2,3)
    test = relationship("Test", back_populates="questions")

class Option(Base):
    __tablename__ = "options"
    id = Column(Integer, primary_key=True, index=True)
    text = Column(String)
    question_id = Column(Integer, ForeignKey("questions.id"))
    question = relationship("Question", back_populates="options")
