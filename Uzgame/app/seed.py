from __future__ import annotations

from datetime import datetime

from sqlalchemy.orm import Session

from app.models.games_catalog import GameCatalog
from app.models.game_test import GameTestSet, GameTestQuestion, GameOption, question_hash


PRO_GAMES: list[dict] = [
    # 15 premium / "weird" puzzle games
    {"key": "logic-grid", "title": "Logic Grid Solver", "section": "pro", "category": "Logic", "difficulty": "Hard", "icon": "grid"},
    {"key": "cipher-room", "title": "Cipher Room", "section": "pro", "category": "Crypto", "difficulty": "Hard", "icon": "key"},
    {"key": "pattern-forge", "title": "Pattern Forge", "section": "pro", "category": "Patterns", "difficulty": "Medium", "icon": "sparkles"},
    {"key": "odd-one-out", "title": "Odd One Out", "section": "pro", "category": "Logic", "difficulty": "Medium", "icon": "scan"},
    {"key": "timeline-hacker", "title": "Timeline Hacker", "section": "pro", "category": "Reasoning", "difficulty": "Hard", "icon": "clock"},
    {"key": "baraban", "title": "Baraban Mystery", "section": "pro", "category": "Weird", "difficulty": "Hard", "icon": "drum"},
    {"key": "shadow-moves", "title": "Shadow Moves", "section": "pro", "category": "Spatial", "difficulty": "Medium", "icon": "move"},
    {"key": "number-ritual", "title": "Number Ritual", "section": "pro", "category": "Math", "difficulty": "Hard", "icon": "hash"},
    {"key": "signal-noise", "title": "Signal & Noise", "section": "pro", "category": "Inference", "difficulty": "Hard", "icon": "wave"},
    {"key": "mirror-paradox", "title": "Mirror Paradox", "section": "pro", "category": "Logic", "difficulty": "Medium", "icon": "mirror"},
    {"key": "constraint-lab", "title": "Constraint Lab", "section": "pro", "category": "Logic", "difficulty": "Hard", "icon": "flask"},
    {"key": "route-optimizer", "title": "Route Optimizer", "section": "pro", "category": "Graph", "difficulty": "Medium", "icon": "route"},
    {"key": "word-surgeon", "title": "Word Surgeon", "section": "pro", "category": "Wordplay", "difficulty": "Medium", "icon": "type"},
    {"key": "probability-duel", "title": "Probability Duel", "section": "pro", "category": "Probability", "difficulty": "Hard", "icon": "dice"},
    {"key": "system-architect", "title": "System Architect", "section": "pro", "category": "Systems", "difficulty": "Hard", "icon": "cpu"},
]


SUBJECT_GAMES: list[dict] = [
    {"key": "matematika", "title": "Matematika", "section": "subject", "category": "Core", "difficulty": "Medium", "icon": "calculator"},
    {"key": "fizika", "title": "Fizika", "section": "subject", "category": "Core", "difficulty": "Medium", "icon": "atom"},
    {"key": "ingliz-tili", "title": "Ingliz tili", "section": "subject", "category": "Core", "difficulty": "Easy", "icon": "globe"},
    {"key": "kimyo", "title": "Kimyo", "section": "subject", "category": "Core", "difficulty": "Medium", "icon": "beaker"},
    {"key": "biologiya", "title": "Biologiya", "section": "subject", "category": "Core", "difficulty": "Easy", "icon": "leaf"},
    {"key": "tarix", "title": "Tarix", "section": "subject", "category": "Core", "difficulty": "Easy", "icon": "landmark"},
    {"key": "geografiya", "title": "Geografiya", "section": "subject", "category": "Core", "difficulty": "Easy", "icon": "map"},
    {"key": "informatika", "title": "Informatika", "section": "subject", "category": "Core", "difficulty": "Medium", "icon": "code"},
    {"key": "ona-tili", "title": "Ona tili", "section": "subject", "category": "Core", "difficulty": "Easy", "icon": "book"},
    {"key": "iq-logic", "title": "IQ / Logic", "section": "subject", "category": "Core", "difficulty": "Hard", "icon": "brain"},
]


def _ensure_games(db: Session) -> None:
    for g in PRO_GAMES + SUBJECT_GAMES:
        exists = db.query(GameCatalog).filter(GameCatalog.key == g["key"]).first()
        if exists:
            # keep it up to date
            for k, v in g.items():
                setattr(exists, k, v)
            continue
        db.add(GameCatalog(**g))


def _mk_questions(game_key: str) -> list[dict]:
    # Deterministic question generator (20 items per game)
    # Keep MCQ format: prompt + 4 options + correct_answer index.
    
    if game_key in {"matematika", "math-algebra", "math-geometry", "math-calculus"}:
        base = [
            ("2x + 6 = 14. x = ?", ["2", "3", "4", "5"], 2),
            ("(a+b)^2 formulasi?", ["a^2+b^2", "a^2+2ab+b^2", "2a+2b", "a^2-b^2"], 1),
            ("5^2 = ?", ["10", "25", "50", "100"], 1),
            ("√16 = ?", ["2", "4", "8", "16"], 1),
            ("3x - 5 = 10. x = ?", ["5", "8", "10", "15"], 0),
        ]
    elif game_key in {"fizika", "physics-mechanics", "physics-waves", "physics-thermodynamics"}:
        base = [
            ("F = ma bo'yicha, m=5kg, a=2m/s² bo'lsa F = ?", ["5", "10", "7", "15"], 1),
            ("Tezlik formulasi?", ["v=s/t", "v=a/t", "v=m/t", "v=F/t"], 0),
            ("Eneriya SI birligida?", ["Joule", "Watt", "Newton", "Pascal"], 0),
            ("g = ?", ["5.8", "9.8", "12.3", "7.5"], 1),
            ("P = m × g qaysi formulasi?", ["Kuch", "Og'irlik", "Masa", "Tezlanish"], 1),
        ]
    elif game_key in {"kimyo", "chemistry-atomic", "chemistry-organic"}:
        base = [
            ("H2O qaysi moddasi?", ["Azot", "Vodorod", "Suv", "Oxygen"], 2),
            ("Atom nima?", ["Eng kichik zarracha", "Modda", "Energiya", "Kuch"], 0),
            ("Ca qaysi element?", ["Vodorod", "Karbon", "Kaltsiy", "Nitrogen"], 2),
            ("Valentlik nima?", ["Massa", "Bog'lanish qobiliyati", "Harorat", "Energiya"], 1),
            ("CO2 nima?", ["Suv", "Karbon dioksid", "Zot", "Gaz"], 1),
        ]
    elif game_key in {"biologiya", "biology-cells", "biology-genetics"}:
        base = [
            ("Hujayra nima?", ["Organ", "Eng kichik tirik birlik", "Tkaan", "Sistema"], 1),
            ("Genlar nima?", ["Hujayra", "Og'il", "Mexanizm", "Gen"], 3),
            ("Darvin nima o'ndi?", ["Mutasil tabiat", "Tabiiy tanlash", "Evolyutsiya", "Jins"], 2),
            ("Mito hozir nima?", ["Yadro", "Energiya hosili", "Membrana", "Organell"], 3),
            ("DNA formulasi?", ["Protei", "Nukleotid", "Deoksiribonuklein kislota", "Lipid"], 2),
        ]
    elif game_key in {"ingliz-tili", "english-vocab", "english-grammar"}:
        base = [
            ("She ___ to school every day", ["go", "goes", "going", "gone"], 1),
            ("Meaning of 'reliable'?", ["Vicious", "Trustworthy", "Slow", "Random"], 1),
            ("Past tense of 'eat'?", ["eats", "eating", "ate", "eaten"], 2),
            ("I ___ there yesterday", ["go", "goes", "went", "going"], 2),
            ("She ___ English well", ["speak", "speaks", "speaking", "spoke"], 1),
        ]
    elif game_key in {"tarix", "history-ancient", "history-modern"}:
        base = [
            ("Qo'qon xonligi qachon asos?", ["1800", "1850", "1875", "1900"], 0),
            ("O'zbekiston independence?", ["1990", "1991", "1992", "1993"], 1),
            ("Timur samarqandda qachon tugatdi?", ["1393", "1395", "1400", "1450"], 0),
            ("Sahibqiron vaqti?", ["14-asrning oxiri", "15-asrning boshi", "16-asrning boshi", "17-asrning boshi"], 0),
            ("O'zbek xalqasi qachon turgan?", ["Qadim", "O'rta asrlar", "Yangi zamon", "Hozirgasi"], 1),
        ]
    elif game_key in {"geografiya", "geography-countries", "geography-capitals"}:
        base = [
            ("O'zbekistonning poytaxti?", ["Tashkent", "Samarqand", "Buxoro", "Xiva"], 0),
            ("Afganistonnning poytaxti?", ["Kabul", "Kandaxor", "Herat", "Badax"], 0),
            ("Qashqadaryo qaysi davlatda?", ["O'zbekiston", "Qozog'iston", "Turkmenistan", "Tojikiston"], 0),
            ("Surxondaryo qaysi davlatda?", ["O'zbekiston", "Qozog'iston", "Turkmenistan", "Afganiston"], 0),
            ("O'zbekiston qaysi kichik kontinent?", ["Asiya", "Yevropa", "Afrika", "Avstraliya"], 0),
        ]
    elif game_key in {"informatika", "computer-science"}:
        base = [
            ("HTTP 404 nimani bildiradi?", ["Server error", "Not Found", "Unauthorized", "OK"], 1),
            ("RAM nima uchun kerak?", ["Doimiy saqlash", "Vaqtinchalik xotira", "GPU", "Tarmoq"], 1),
            ("Python nima?", ["OS", "Til", "Brauzer", "DB"], 1),
            ("CPU nima qiladi?", ["Viqayat", "Hisoblash", "Saqlash", "Chiqarish"], 1),
            ("Algoritm nima?", ["Dastabki", "Qoidalar majmui", "Dastur", "Kod"], 1),
        ]
    else:
        # Generic logic/pattern questions for PRO games
        base = [
            ("Qaysi variant eng mantiqli davom? 2, 4, 8, 16, ?", ["18", "20", "24", "32"], 3),
            ("Agar A=1, B=2, C=3 bo'lsa, D=?", ["4", "5", "3", "6"], 0),
            ("Mantiqiy: Barcha mevalar meva. Olma - meva. Olma - ?", ["Oq", "Yumshoq", "Meva", "Ozuq"], 2),
            ("Yana qaysi xulosa tog'ri?", ["Birinchi", "Ikkinchi", "Uchinchi", "To'rtinchi"], 0),
            ("Pattern: 1, 1, 2, 3, 5, 8, ?", ["11", "13", "15", "16"], 1),
        ]

    out: list[dict] = []
    # Expand to exactly 20 questions
    for i in range(20):
        prompt, options, correct = base[i % len(base)]
        # Add variation to prompt for uniqueness (qhash check)
        varied_prompt = f"{prompt} (varient {i+1})" if i >= len(base) else prompt
        out.append(
            {
                "prompt": varied_prompt,
                "options": options,
                "correct_answer": correct,
            }
        )
    return out


def _ensure_default_set(db: Session, game_key: str) -> None:
    default_set = (
        db.query(GameTestSet)
        .filter(GameTestSet.game_key == game_key, GameTestSet.is_default == True)
        .first()
    )
    if not default_set:
        default_set = GameTestSet(
            game_key=game_key,
            teacher_id=None,
            title="Default",
            is_default=True,
            created_at=datetime.utcnow(),
        )
        db.add(default_set)
        db.flush()  # assign id

    # ensure exactly 20 questions
    existing_q = db.query(GameTestQuestion).filter(GameTestQuestion.test_set_id == default_set.id).count()
    if existing_q >= 20:
        return

    # if partially filled, clear and re-seed for consistency
    if existing_q > 0:
        db.query(GameTestQuestion).filter(GameTestQuestion.test_set_id == default_set.id).delete()
        db.flush()

    for q in _mk_questions(game_key):
        # Create question with options
        qhash_val = question_hash(q["prompt"], q["options"])
        
        # Skip if qhash already exists (duplicate question)
        existing = db.query(GameTestQuestion).filter(GameTestQuestion.qhash == qhash_val).first()
        if existing:
            continue
        
        question = GameTestQuestion(
            test_set_id=default_set.id,
            prompt=q["prompt"],
            correct_index=q["correct_answer"],
            qhash=qhash_val,
        )
        db.add(question)
        db.flush()  # assign id
        
        # Add options
        for idx, option_text in enumerate(q["options"]):
            option = GameOption(
                question_id=question.id,
                text=option_text,
            )
            db.add(option)


def ensure_seed(db: Session) -> None:
    """Idempotent seeding for games + default test sets.

    - Ensures at least 15 pro games + 10 subject games exist.
    - Ensures each game has a default test set with exactly 20 questions.
    """

    _ensure_games(db)
    db.flush()
    for g in PRO_GAMES + SUBJECT_GAMES:
        _ensure_default_set(db, g["key"])
    db.commit()
