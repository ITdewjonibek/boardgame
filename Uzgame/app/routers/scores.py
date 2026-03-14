from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.database import get_db
from app.models.base import Game, TestSet, Score, User
from app.auth.auth import get_current_user


router = APIRouter(prefix="/scores", tags=["scores"])


class ScoreCreate(BaseModel):
    game_slug: str
    test_set_id: int
    score: int
    time_spent: int


@router.post("")
def submit_score(payload: ScoreCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    game = db.query(Game).filter(Game.key == payload.game_slug).first()
    if not game:
        raise HTTPException(status_code=404, detail="Game not found")

    tset = db.query(TestSet).filter(TestSet.id == payload.test_set_id).first()
    if not tset:
        raise HTTPException(status_code=404, detail="Test set not found")

    s = Score(user_id=current_user.id, game_id=game.id, room_id=None, score=int(payload.score))
    db.add(s)
    db.commit()
    db.refresh(s)
    return {"status": "ok", "id": s.id}
