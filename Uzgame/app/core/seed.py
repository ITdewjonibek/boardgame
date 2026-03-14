import hashlib
from sqlalchemy.orm import Session
from app.models.base import Game, TestSet, Question, Option

def get_qhash(prompt: str, options: list):
    # Hash of prompt + sorted option texts
    opt_str = "|".join(sorted([o.lower().strip() for o in options]))
    content = f"{prompt.lower().strip()}:{opt_str}"
    return hashlib.sha256(content.encode()).hexdigest()

def seed_data(db: Session):
    # 15 PRO GAMES
    pro_games = [
        ("logic-grid", "Logic Grid Solver"),
        ("code-breaker", "Code Breaker"),
        ("strategy-arena", "Strategy Arena"),
        ("pattern-ai", "Pattern Prediction AI"),
        ("memory-matrix", "Memory Matrix Advanced"),
        ("maze-escape", "Maze AI Escape"),
        ("reaction-pro", "Reaction Speed Pro"),
        ("decision-sim", "Decision Simulator"),
        ("risk-calc", "Risk Calculation Game"),
        ("cipher-cracker", "Cipher Cracker"),
        ("sequence-builder", "Sequence Builder"),
        ("prob-duel", "Probability Duel"),
        ("resource-strat", "Resource Strategy"),
        ("reflex-arena", "Reflex Arena"),
        ("tactical-quiz", "Tactical Quiz Battle")
    ]

    # 10 SUBJECT GAMES
    subject_games = [
        ("math-pro", "Math Challenge Pro"),
        ("physics-sim", "Physics Simulation Quiz"),
        ("english-duel", "English Grammar Duel"),
        ("chem-reactor", "Chemistry Reaction Builder"),
        ("bio-synth", "Biology System Builder"),
        ("geo-map", "Geography Map Strategy"),
        ("history-time", "History Timeline War"),
        ("info-code", "Informatics Logic Code"),
        ("lit-analysis", "Literature Analysis Game"),
        ("iq-trainer", "Advanced IQ Trainer")
    ]

    for key, title in pro_games:
        _create_game(db, key, title, "pro")

    for key, title in subject_games:
        _create_game(db, key, title, "subject")

def _create_game(db: Session, key: str, title: str, section: str):
    game = db.query(Game).filter(Game.key == key).first()
    if not game:
        game = Game(
            key=key, 
            title=title, 
            section=section, 
            icon_key="Gamepad2" if section == "pro" else "BookOpen",
            difficulty="Qiyin" if section == "pro" else "O'rta"
        )
        db.add(game)
        db.commit()
        db.refresh(game)
        
        # Create Default Set
        test_set = TestSet(game_id=game.id, name="default")
        db.add(test_set)
        db.commit()
        db.refresh(test_set)

        # Seed 20 Questions
        for i in range(1, 21):
            prompt = f"Advanced {title} Logic Module #{i}: Analyze the given parameters for optimal output."
            opt_texts = [f"Result Delta {j}" for j in range(1, 5)]
            qhash = get_qhash(prompt, opt_texts)
            
            question = Question(
                set_id=test_set.id,
                prompt=prompt,
                explanation=f"Explanation for {title} module {i}",
                qhash=qhash
            )
            db.add(question)
            db.commit()
            db.refresh(question)

            for j, opt_text in enumerate(opt_texts):
                db.add(Option(
                    question_id=question.id,
                    text=opt_text,
                    is_correct=(j == 0)
                ))
        db.commit()
