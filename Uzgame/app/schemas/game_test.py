from pydantic import BaseModel, Field
from typing import List
from datetime import datetime


class GameOptionIn(BaseModel):
    text: str = Field(..., min_length=1, max_length=300)


class GameQuestionIn(BaseModel):
    prompt: str = Field(..., min_length=3, max_length=800)
    options: List[GameOptionIn] = Field(..., min_length=4, max_length=4)
    correct_index: int = Field(..., ge=0, le=3)
    explanation: str = Field(default="No explanation provided", max_length=1000)
    difficulty: str = Field(default="medium")


class GameTestSetCreate(BaseModel):
    game_key: str = Field(..., min_length=2, max_length=50)
    title: str = Field(..., min_length=2, max_length=200)
    questions: List[GameQuestionIn] = Field(..., min_length=1)  # Removed max 20 limit


class GameOptionOut(BaseModel):
    id: int
    text: str

    class Config:
        from_attributes = True


class GameQuestionOut(BaseModel):
    id: int
    prompt: str
    correct_index: int
    explanation: str
    difficulty: str
    options: List[GameOptionOut]

    class Config:
        from_attributes = True


class GameTestSetOut(BaseModel):
    id: int
    game_key: str
    title: str
    teacher_id: int
    created_at: datetime
    is_premium: bool
    questions: List[GameQuestionOut] = []

    class Config:
        from_attributes = True
