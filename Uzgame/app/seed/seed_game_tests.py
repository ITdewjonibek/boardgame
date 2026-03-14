from __future__ import annotations

import hashlib
from datetime import datetime

from sqlalchemy import text
from sqlalchemy.orm import Session

from app.models.games_catalog import GameCatalog
from app.models.game_test import GameTestSet, GameTestQuestion


def _qhash(prompt: str, options: list[str]) -> str:
    blob = (prompt.strip() + "|" + "|".join(sorted([o.strip() for o in options]))).encode("utf-8")
    return hashlib.sha256(blob).hexdigest()


def _make_default_questions(game_key: str) -> list[dict]:
    """Generate 20 good-enough default questions.

    NOTE: These are placeholders so the app is ALWAYS playable.
    Teachers can add real sets later.
    """
    base = [
        {
            "prompt": f"({i+1}) {game_key}: To'g'ri javobni tanlang.",
            "options": ["A variant", "B variant", "C variant", "D variant"],
            "correct_index": (i % 4),
            "explanation": "Default set (seed). Teacher keyinroq yangilaydi.",
        }
        for i in range(20)
    ]
    return base


def ensure_game_tests_seed(db: Session) -> None:
    """Idempotent seeding:
    - For each game, ensure a default set exists (teacher_id NULL, title='default')
    - Ensure exactly 20 questions exist under that set (creates missing)
    """

    # If DB was created with teacher_id NOT NULL, relax it (best-effort).
    try:
        db.execute(text("ALTER TABLE game_test_sets ALTER COLUMN teacher_id DROP NOT NULL"))
        db.commit()
    except Exception:
        db.rollback()

    games = db.query(GameCatalog).all()
    for g in games:
        default_set = (
            db.query(GameTestSet)
            .filter(GameTestSet.game_key == g.key, GameTestSet.teacher_id.is_(None))
            .first()
        )
        if not default_set:
            default_set = GameTestSet(
                game_key=g.key,
                teacher_id=None,
                title="default",
                created_at=datetime.utcnow(),
            )
            db.add(default_set)
            db.commit()
            db.refresh(default_set)

        existing_q = db.query(GameTestQuestion).filter(GameTestQuestion.test_set_id == default_set.id).all()
        if len(existing_q) >= 20:
            continue

        needed = 20 - len(existing_q)
        questions = _make_default_questions(g.key)
        # Avoid duplicates by qhash
        existing_hashes = {q.qhash for q in existing_q}
        created = 0
        for q in questions:
            qh = _qhash(q["prompt"], q["options"])
            if qh in existing_hashes:
                continue
            db.add(
                GameTestQuestion(
                    test_set_id=default_set.id,
                    prompt=q["prompt"],
                    options=q["options"],
                    correct_index=q["correct_index"],
                    explanation=q.get("explanation"),
                    qhash=qh,
                )
            )
            existing_hashes.add(qh)
            created += 1
            if created >= needed:
                break
        db.commit()
