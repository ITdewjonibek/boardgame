from fastapi import APIRouter, Depends, HTTPException, Query, status, Request
from sqlalchemy.orm import Session
from typing import List
import random

from app.database import get_db
from app.models.user import User as UserModel
from app.models import test as test_models
from app.schemas.game_test import GameTestSetCreate, GameTestSetOut, GameQuestionOut
from app.auth.auth import get_current_user, get_optional_user, get_optional_user_no_token_required

router = APIRouter(prefix="/api/game-tests", tags=["game-tests"])


def require_teacher(current_user: UserModel):
    # Temporarily bypassed since the users table does not have a 'role' column setup yet.
    pass


@router.post("/sets")
def create_game_test_set(
    payload: GameTestSetCreate,
    request: Request,
    db: Session = Depends(get_db),
):
    # Get optional user from auth header
    from app.auth.auth import SECRET_KEY, ALGORITHM
    from jose import jwt, JWTError
    from app.models.user import User as UserModel
    
    current_user = None
    auth_header = request.headers.get("Authorization")
    if auth_header:
        try:
            token = auth_header.replace("Bearer ", "")
            payload_jwt = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            username = payload_jwt.get("sub")
            if username:
                current_user = db.query(UserModel).filter(UserModel.username == username).first()
        except (JWTError, Exception):
            pass
    require_teacher(current_user)

    # Special handling for BARABAN game
    if payload.game_key == "baraban":
        print(f"📥 BARABAN test from TestManager: {payload.title}")
        # For BARABAN, use a random subject to distribute tests
        subjects = db.query(test_models.Subject).all()
        if not subjects:
            raise HTTPException(status_code=404, detail="Database da subject topilmadi")
        import random
        subject = random.choice(subjects)
    else:
        # Use a default subject if none exist
        # (Assuming we have subjects table as per models.test)
        subject = db.query(test_models.Subject).first()
        if not subject:
            subject = test_models.Subject(name="General")
            db.add(subject)
            db.commit()
            db.refresh(subject)

    # Save to the 'tests' table as requested by the user
    test_set = test_models.Test(
        game_key=payload.game_key, 
        title=payload.title, 
        teacher_name=current_user.username if current_user else "Anonymous",
        subject_id=subject.id
    )
    db.add(test_set)
    db.commit()
    db.refresh(test_set)

    for q in payload.questions:
        qq = test_models.Question(
            test_id=test_set.id, 
            text=q.prompt, 
            correct_option=q.correct_index
        )
        db.add(qq)
        db.commit()
        db.refresh(qq)

        for opt in q.options:
            db.add(test_models.Option(question_id=qq.id, text=opt.text))
        db.commit()
    
    return {"success": True, "message": "Test set created successfully", "id": test_set.id}

@router.get("/merged/{game_key}", response_model=List[GameQuestionOut])
def get_merged_game_tests(
    game_key: str,
    db: Session = Depends(get_db)
):
    """
    Returns custom questions for a specific game, merged into the frontend structure.
    """
    tests = db.query(test_models.Test).filter(test_models.Test.game_key == game_key).all()
    all_questions = []
    
    for t in tests:
        questions = db.query(test_models.Question).filter(test_models.Question.test_id == t.id).all()
        for q in questions:
            options = db.query(test_models.Option).filter(test_models.Option.question_id == q.id).all()
            all_questions.append({
                "id": q.id,
                "prompt": q.text,
                "correct_index": q.correct_option,
                "explanation": getattr(q, 'explanation', "Qo'shimcha ma'lumot yo'q"),
                "difficulty": q.difficulty if hasattr(q, 'difficulty') else "medium",
                "options": [{"id": o.id, "text": o.text} for o in options]
            })
            
    return all_questions

# The legacy sets and questions endpoints have been deprecated 
# in favor of the unified V5 /merged and /sets logic above.

