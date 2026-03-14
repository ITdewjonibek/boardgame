from sqlalchemy import Column, Integer, String, JSON
from app.database import Base


class RoosterQuestion(Base):
    __tablename__ = "rooster_questions"
    
    id = Column(Integer, primary_key=True, index=True)
    number = Column(Integer, unique=True, index=True)
    question = Column(String)
    options = Column(JSON)  # Store as JSON array
    correctAnswer = Column(Integer)
    category = Column(String)
