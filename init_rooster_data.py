#!/usr/bin/env python
import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'Uzgame'))

from app.database import Base, engine, get_db
from app.routers.rooster import RoosterQuestion, default_questions
from sqlalchemy.orm import Session

# Create tables
Base.metadata.create_all(bind=engine)

# Add default questions
db = next(get_db())
try:
    # Clear existing questions
    db.query(RoosterQuestion).delete()
    
    # Add new questions
    for q_data in default_questions:
        question = RoosterQuestion(
            number=q_data['number'],
            question=q_data['question'],
            options=q_data['options'],
            correctAnswer=q_data['correctAnswer'],
            category=q_data['category']
        )
        db.add(question)
    
    db.commit()
    print(f"✅ Successfully initialized {len(default_questions)} rooster questions!")
except Exception as e:
    db.rollback()
    print(f"❌ Error: {e}")
finally:
    db.close()
