from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class QuestionBase(BaseModel):
    game_name: str
    question_text: str
    options: List[str]
    correct_answer: int
    difficulty: str
    explanation: Optional[str] = None
    formula: Optional[str] = None
    points: int = 1

class QuestionCreate(QuestionBase):
    pass

class Question(QuestionBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class GameProgressBase(BaseModel):
    game_name: str
    score: int
    total_questions: int
    difficulty: str
    time_spent: float

class GameProgressCreate(GameProgressBase):
    user_id: int

class GameProgress(GameProgressBase):
    id: int
    user_id: int
    completed: bool
    created_at: datetime

    class Config:
        from_attributes = True

class GameScore(BaseModel):
    game_name: str
    score: int
    total: int
    percentage: float
    difficulty: str
    timestamp: datetime

class TeamGameProgressBase(BaseModel):
    game_name: str
    section_number: int
    difficulty: str
    team1_score: int = 0
    team2_score: int = 0
    total_questions: int = 20

class TeamGameProgressCreate(TeamGameProgressBase):
    team1_player_id: Optional[int] = None
    team2_player_id: Optional[int] = None

class TeamGameProgress(TeamGameProgressBase):
    id: int
    completed: bool
    winner: Optional[str] = None
    total_time_spent: float = 0
    created_at: datetime
    completed_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class TeamGameResult(BaseModel):
    game_name: str
    section_number: int
    difficulty: str
    team1_score: int
    team2_score: int
    winner: str
    total_time_spent: float
