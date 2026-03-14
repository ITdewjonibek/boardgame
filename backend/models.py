from sqlalchemy import Column, Integer, String, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)


class Game(Base):
    __tablename__ = "games"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    slug = Column(
        String(50),
        unique=True,
        nullable=False,
        index=True
    )  # wheel, tug_of_war, word_search, country, champion, quiz, millionaire, memory, math, word

    sections = relationship("Section", back_populates="game", order_by="Section.order")


class Section(Base):
    __tablename__ = "sections"

    id = Column(Integer, primary_key=True, index=True)
    game_id = Column(Integer, ForeignKey("games.id"), nullable=False)
    name = Column(String(200), nullable=False)
    order = Column(Integer, default=0, nullable=False)

    game = relationship("Game", back_populates="sections")
    tests = relationship("Test", back_populates="section", order_by="Test.id")


class Test(Base):
    __tablename__ = "tests"

    id = Column(Integer, primary_key=True, index=True)
    section_id = Column(Integer, ForeignKey("sections.id"), nullable=True)
    game_key = Column(String(50), nullable=True, index=True)
    question = Column(Text, nullable=False)
    options = Column(JSON, nullable=False)  # JSON array of 4 strings
    correct_index = Column(Integer, nullable=False)  # 0-3
    explanation = Column(Text, nullable=True)
    difficulty = Column(String(20), default="medium")

    section = relationship("Section", back_populates="tests")
