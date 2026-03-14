import sys
import os

# Add the app directory to sys.path
sys.path.append(os.path.join(os.path.dirname(__file__), "app"))

from sqlalchemy.orm import Session
from app.database import sessionlocal, engine, Base
from app.models.game import GameQuestion

# Create tables if they don't exist
Base.metadata.create_all(bind=engine)

def seed():
    db = sessionlocal()
    
    questions = [
        # MATH QUIZ
        {"game_name": "math", "difficulty": "Oson", "q": "2 + 3 = ?", "opts": ["4", "5", "6", "7"], "correct": 1},
        {"game_name": "math", "difficulty": "Oson", "q": "10 - 3 = ?", "opts": ["5", "6", "7", "8"], "correct": 2},
        {"game_name": "math", "difficulty": "Oson", "q": "2 × 4 = ?", "opts": ["6", "8", "10", "12"], "correct": 1},
        {"game_name": "math", "difficulty": "Oson", "q": "12 ÷ 3 = ?", "opts": ["2", "3", "4", "5"], "correct": 2},
        {"game_name": "math", "difficulty": "Oson", "q": "5² = ?", "opts": ["20", "25", "30", "35"], "correct": 1},
        {"game_name": "math", "difficulty": "Oson", "q": "6 + 7 = ?", "opts": ["12", "13", "14", "15"], "correct": 1},
        {"game_name": "math", "difficulty": "Oson", "q": "15 - 8 = ?", "opts": ["5", "6", "7", "8"], "correct": 2},
        
        {"game_name": "math", "difficulty": "O'rta", "q": "15² - 10² = ?", "opts": ["100", "125", "150", "175"], "correct": 1},
        {"game_name": "math", "difficulty": "O'rta", "q": "√144 = ?", "opts": ["10", "11", "12", "13"], "correct": 2},
        {"game_name": "math", "difficulty": "O'rta", "q": "3³ + 2³ = ?", "opts": ["25", "30", "35", "40"], "correct": 1},
        
        {"game_name": "math", "difficulty": "Qiyin", "q": "∫(x²)dx = ?", "opts": ["x³/2", "x³/3", "x²/2", "x/3"], "correct": 1},
        {"game_name": "math", "difficulty": "Qiyin", "q": "log₂(8) = ?", "opts": ["2", "3", "4", "5"], "correct": 1},
        
        # HISTORY TRIVIA
        {"game_name": "history", "difficulty": "Oson", "q": "O'zbekiston mustaqil bo'lgan yil?", "opts": ["1990", "1991", "1992", "1993"], "correct": 1},
        {"game_name": "history", "difficulty": "Oson", "q": "Poytaxt?", "opts": ["Samarqand", "Buxoro", "Toshkent", "Xiva"], "correct": 2},
        {"game_name": "history", "difficulty": "O'rta", "q": "Amir Temur Samarqandni qachon bosdi?", "opts": ["1336", "1360", "1370", "1380"], "correct": 2},
        
        # ENGLISH VOCAB
        {"game_name": "english", "difficulty": "Oson", "q": "Which is a fruit?", "opts": ["Table", "Apple", "Car", "Blue"], "correct": 1},
        {"game_name": "english", "difficulty": "Oson", "q": "Hello means...", "opts": ["Salom", "Xayr", "Rahmat", "Iltimos"], "correct": 0},
    ]

    print(f"Seeding {len(questions)} questions...")
    for q_data in questions:
        # Check if exists
        exists = db.query(GameQuestion).filter(
            GameQuestion.game_name == q_data["game_name"],
            GameQuestion.question_text == q_data["q"]
        ).first()
        
        if not exists:
            q = GameQuestion(
                game_name=q_data["game_name"],
                question_text=q_data["q"],
                options=q_data["opts"],
                correct_answer=q_data["correct"],
                difficulty=q_data["difficulty"]
            )
            db.add(q)
    
    db.commit()
    db.close()
    print("Seeding complete!")

if __name__ == "__main__":
    seed()
