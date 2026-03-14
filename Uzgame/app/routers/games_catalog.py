from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.games_catalog import GameCatalog

# Frontend expects:
#   GET /api/games?section=pro|subject
#   GET /api/games/{game_key}
# Older builds accidentally used /api/games/games. We keep it as a legacy alias.
router = APIRouter(prefix="/api", tags=["games"])

# Predefined PRO games (15 ta)
PRO_GAMES = [
    {"key": "logic-grid", "title": "Logic Grid Solver", "description": "Grid va clues orqali logik masalalarni hal qiling", "category": "Logic", "difficulty": "Medium"},
    {"key": "cipher-breaker", "title": "Cipher Breaker", "description": "Caesar/Vigenere shifrlashni qirqish", "category": "Puzzle", "difficulty": "Hard"},
    {"key": "pattern-forge", "title": "Pattern Forge", "description": "Ketma-ketlikdagi naqshni aniqlang", "category": "Logic", "difficulty": "Medium"},
    {"key": "memory-matrix", "title": "Memory Matrix Pro", "description": "3 darajali yaddori o'yini", "category": "Memory", "difficulty": "Medium"},
    {"key": "spatial-rotation", "title": "Spatial Rotation", "description": "Mental 3D aylantirishni test qiling", "category": "Spatial", "difficulty": "Hard"},
    {"key": "deduction-room", "title": "Deduction Room", "description": "Who-did-it tipidagi mantiq jumboree", "category": "Logic", "difficulty": "Hard"},
    {"key": "code-lock", "title": "Code Lock", "description": "Multi-step riddle va kod qanchasini ochish", "category": "Puzzle", "difficulty": "Hard"},
    {"key": "timeline-order", "title": "Timeline Order", "description": "Tarixiy voqealarni to'g'ri tartibda joylashtiring", "category": "Knowledge", "difficulty": "Medium"},
    {"key": "wheel-spin", "title": "Baraban Metodi", "description": "Ismlar / savollar uchun interaktiv baraban", "category": "Classroom", "difficulty": "Easy"},
    {"key": "probability-duel", "title": "Probability Duel", "description": "Ehtimollik va kutilayotgan qiymatni hisoblang", "category": "Math", "difficulty": "Hard"},
    {"key": "word-ladder", "title": "Word Ladder Pro", "description": "So'zning bir harfini o'zgartirib boshqa so'zga o'ting", "category": "Word", "difficulty": "Medium"},
    {"key": "sudoku-mini", "title": "Sudoku Mini", "description": "4x4 yoki 6x6 sudoku (klassik o'yindan qisqaroq)", "category": "Logic", "difficulty": "Medium"},
    {"key": "nonogram-mini", "title": "Nonogram Mini", "description": "Raqamlarga asoslangan piksel rasm topish", "category": "Logic", "difficulty": "Medium"},
    {"key": "rope-game", "title": "Arqon Tortish", "description": "2 jamoa navbat bilan savolga javob beradi — scoreboard bilan", "category": "Team", "difficulty": "Medium"},
    {"key": "boxing-duel", "title": "Boks Duel", "description": "Arqon tortishga o'xshash, lekin boks animatsiyasi bilan", "category": "Team", "difficulty": "Hard"},
]

# Predefined SUBJECT modules (20 ta)
SUBJECT_MODULES = [
    {"key": "math-algebra", "title": "Matematika: Algebra", "category": "Matematika", "difficulty": "Easy"},
    {"key": "math-geometry", "title": "Matematika: Geometriya", "category": "Matematika", "difficulty": "Medium"},
    {"key": "math-calculus", "title": "Matematika: Analiz", "category": "Matematika", "difficulty": "Hard"},
    {"key": "physics-mechanics", "title": "Fizika: Mexanika", "category": "Fizika", "difficulty": "Easy"},
    {"key": "physics-thermodynamics", "title": "Fizika: Termodinamika", "category": "Fizika", "difficulty": "Medium"},
    {"key": "physics-waves", "title": "Fizika: To'lqinlar", "category": "Fizika", "difficulty": "Hard"},
    {"key": "chemistry-atomic", "title": "Kimyo: Atom tuzilishi", "category": "Kimyo", "difficulty": "Easy"},
    {"key": "chemistry-organic", "title": "Kimyo: Organik Kimyo", "category": "Kimyo", "difficulty": "Hard"},
    {"key": "biology-cells", "title": "Biologiya: Hujayra", "category": "Biologiya", "difficulty": "Easy"},
    {"key": "biology-genetics", "title": "Biologiya: Genetika", "category": "Biologiya", "difficulty": "Hard"},
    {"key": "english-vocab", "title": "Ingliz tili: Lug'at", "category": "Ingliz tili", "difficulty": "Easy"},
    {"key": "english-grammar", "title": "Ingliz tili: Grammer", "category": "Ingliz tili", "difficulty": "Medium"},
    {"key": "history-modern", "title": "Tarix: Zamonaviy tarix", "category": "Tarix", "difficulty": "Medium"},
    {"key": "history-ancient", "title": "Tarix: Qadimgi tarix", "category": "Tarix", "difficulty": "Easy"},
    {"key": "geography-countries", "title": "Geografiya: Davlatlar", "category": "Geografiya", "difficulty": "Easy"},
    {"key": "geography-capitals", "title": "Geografiya: Poytaxtlar", "category": "Geografiya", "difficulty": "Easy"},
    {"key": "computer-science", "title": "Informatika: Algoritmlar", "category": "Informatika", "difficulty": "Hard"},
    {"key": "uzbek-language", "title": "O'zbek tili: Grammatika", "category": "O'zbek tili", "difficulty": "Easy"},
    {"key": "literature-classics", "title": "Adabiyot: Klassiklar", "category": "Adabiyot", "difficulty": "Medium"},
    {"key": "logic-reasoning", "title": "Mantiq: Tahlil", "category": "Mantiq", "difficulty": "Hard"},
]


@router.get("/games")
async def get_games(
    section: str = Query(None, description="Filter by section: 'pro' or 'subject'"),
    db: Session = Depends(get_db)
):
    """Get all games or filtered by section"""
    query = db.query(GameCatalog).filter(GameCatalog.is_active == True)
    
    if section:
        query = query.filter(GameCatalog.section == section)
    
    games = query.all()
    return {
        "games": [
            {
                "key": g.key,
                "title": g.title,
                "description": g.description,
                "icon": g.icon,
                "difficulty": g.difficulty,
                "section": g.section,
                "category": g.category,
                "estimated_time": g.estimated_time,
                "supports_solo": g.supports_solo,
                "supports_team": g.supports_team,
            }
            for g in games
        ]
    }


# Legacy alias: /api/games/games
@router.get("/games/games")
async def get_games_legacy(
    section: str = Query(None, description="Filter by section: 'pro' or 'subject'"),
    db: Session = Depends(get_db),
):
    return await get_games(section=section, db=db)


@router.get("/games/{game_key}")
async def get_game_detail(
    game_key: str,
    db: Session = Depends(get_db)
):
    """Get specific game detail"""
    game = db.query(GameCatalog).filter(GameCatalog.key == game_key, GameCatalog.is_active == True).first()
    
    if not game:
        raise HTTPException(status_code=404, detail="Game not found")
    
    return {
        "key": game.key,
        "title": game.title,
        "description": game.description,
        "icon": game.icon,
        "difficulty": game.difficulty,
        "section": game.section,
        "category": game.category,
        "estimated_time": game.estimated_time,
        "supports_solo": game.supports_solo,
        "supports_team": game.supports_team,
        "max_questions": game.max_questions,
    }


# Legacy alias: /api/games/games/{game_key}
@router.get("/games/games/{game_key}")
async def get_game_detail_legacy(game_key: str, db: Session = Depends(get_db)):
    return await get_game_detail(game_key=game_key, db=db)


def seed_games(db: Session):
    """Seed all games (idempotent)"""
    existing_keys = {row[0] for row in db.query(GameCatalog.key).all()}
    
    # Add PRO games
    for game_data in PRO_GAMES:
        if game_data["key"] in existing_keys:
            continue
        game = GameCatalog(
            key=game_data["key"],
            title=game_data["title"],
            description=game_data.get("description", ""),
            category=game_data.get("category", ""),
            difficulty=game_data.get("difficulty", "Medium"),
            section="pro",
            supports_solo=True,
            supports_team=True,
            estimated_time=10,
        )
        db.add(game)
    
    # Add SUBJECT modules
    for game_data in SUBJECT_MODULES:
        if game_data["key"] in existing_keys:
            continue
        game = GameCatalog(
            key=game_data["key"],
            title=game_data["title"],
            description=game_data.get("description", ""),
            category=game_data.get("category", ""),
            difficulty=game_data.get("difficulty", "Easy"),
            section="subject",
            supports_solo=True,
            supports_team=True,
            estimated_time=15,
        )
        db.add(game)
    
    db.commit()
