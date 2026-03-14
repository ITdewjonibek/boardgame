from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from database import get_db
from models import Test, Game
from schemas import GameTestSetCreate, GameQuestionOut, GameQuestionCreate

router = APIRouter(prefix="/game-tests", tags=["game-tests"])

@router.get("/merged/{game_slug}")
def get_merged_tests(game_slug: str, db: Session = Depends(get_db)):
    """Fetch database tests for a specific game and return in V5 format."""
    # We use game_slug as game_key in the tests table
    db_tests = db.query(Test).filter(Test.game_key == game_slug).all()
    
    # Map to V5 format (prompt, options with text objects)
    results = []
    for t in db_tests:
        results.append({
            "id": t.id,
            "prompt": t.question,
            "options": [{"text": opt} for opt in t.options],
            "correct_index": t.correct_index,
            "explanation": t.explanation or "To'g'ri javob",
            "difficulty": t.difficulty or "medium"
        })
    
    return results

@router.post("/sets")
def create_game_test_set(payload: GameTestSetCreate, db: Session = Depends(get_db)):
    """Handle the V5 'sets' payload from TestManager."""
    new_ids = []
    for q in payload.questions:
        # Map V5 question to the 'tests' table row
        new_test = Test(
            game_key=payload.game_key,
            question=q.prompt,
            options=[opt["text"] for opt in q.options],
            correct_index=q.correct_index,
            explanation=q.explanation,
            difficulty=q.difficulty
        )
        db.add(new_test)
        db.commit()
        db.refresh(new_test)
        new_ids.append(new_test.id)
    
    return {"status": "ok", "test_ids": new_ids}
