from sqlalchemy import Column, Integer, String, Text, JSON, Boolean, DateTime, Float
from datetime import datetime
from app.database import Base

class GameQuestion(Base):
    __tablename__ = "game_questions"

    id = Column(Integer, primary_key=True, index=True)
    game_id = Column(String, index=True)  # "tugofwar", "math", etc.
    stage_id = Column(Integer, index=True) # Checkpoint/Stage it belongs to
    question_text = Column(Text)
    options = Column(JSON)  # ["A", "B", "C", "D"]
    correct_answer = Column(Integer)  # 0, 1, 2, 3
    difficulty = Column(String)  # "Oson", "O'rta", "Qiyin"
    explanation = Column(Text, nullable=True)
    
    # Reward/Penalty Logic
    reward_type = Column(String, nullable=True)   # "power", "stamina", "speed", "score"
    reward_value = Column(Float, default=0)
    penalty_type = Column(String, nullable=True)  # "stamina_loss", "speed_reduction", "score_deduction"
    penalty_value = Column(Float, default=0)
    
    order_index = Column(Integer, default=0)
    points = Column(Integer, default=1)
    created_at = Column(DateTime, default=datetime.utcnow)

class GameProgress(Base):
    __tablename__ = "game_progress"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True)
    game_name = Column(String, index=True)
    score = Column(Integer)
    total_questions = Column(Integer)
    difficulty = Column(String)
    section_number = Column(Integer, default=1)
    time_spent = Column(Float)
    completed = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class TeamGameProgress(Base):
    __tablename__ = "team_game_progress"

    id = Column(Integer, primary_key=True, index=True)
    game_name = Column(String, index=True)  # "math", "physics", etc
    section_number = Column(Integer, index=True)  # 1-10
    difficulty = Column(String)  # "Oson", "O'rta", "Qiyin"
    team1_player_id = Column(Integer, nullable=True)
    team2_player_id = Column(Integer, nullable=True)
    team1_score = Column(Integer, default=0)
    team2_score = Column(Integer, default=0)
    total_questions = Column(Integer, default=20)  # 20 savol har qiyinlik
    completed = Column(Boolean, default=False)
    winner = Column(String, nullable=True)  # "team1", "team2", "draw"
    total_time_spent = Column(Float, default=0)  # sekund
    created_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)
