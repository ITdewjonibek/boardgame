from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.game import TeamGameProgress, GameQuestion
from app.schemas.gameschemas import (
    TeamGameProgressCreate, 
    TeamGameProgress as TeamGameProgressSchema,
    TeamGameResult
)
from typing import List, Optional
from datetime import datetime

router = APIRouter(prefix="/team-games", tags=["team-games"])

@router.post("/start", response_model=TeamGameProgressSchema)
async def start_team_game(
    game_data: TeamGameProgressCreate,
    db: Session = Depends(get_db)
):
    """Jamoaviy o'yni boshlash"""
    
    # Yangi team game sessiya yaratish
    team_game = TeamGameProgress(
        game_name=game_data.game_name,
        section_number=game_data.section_number,
        difficulty=game_data.difficulty,
        team1_player_id=game_data.team1_player_id,
        team2_player_id=game_data.team2_player_id,
        team1_score=0,
        team2_score=0,
        total_questions=game_data.total_questions,
        completed=False
    )
    
    db.add(team_game)
    db.commit()
    db.refresh(team_game)
    return team_game

@router.put("/{game_id}/update-score", response_model=TeamGameProgressSchema)
async def update_team_score(
    game_id: int,
    team: int,  # 1 yoki 2
    score: int,
    db: Session = Depends(get_db)
):
    """Team ballni yangilash"""
    
    game = db.query(TeamGameProgress).filter(TeamGameProgress.id == game_id).first()
    if not game:
        raise HTTPException(status_code=404, detail="O'yin topilmadi")
    
    if team == 1:
        game.team1_score = score
    elif team == 2:
        game.team2_score = score
    else:
        raise HTTPException(status_code=400, detail="Team 1 yoki 2 bo'lishi kerak")
    
    db.commit()
    db.refresh(game)
    return game

@router.put("/{game_id}/finish", response_model=TeamGameProgressSchema)
async def finish_team_game(
    game_id: int,
    total_time_spent: float,
    db: Session = Depends(get_db)
):
    """Jamoaviy o'yni tugatish"""
    
    game = db.query(TeamGameProgress).filter(TeamGameProgress.id == game_id).first()
    if not game:
        raise HTTPException(status_code=404, detail="O'yin topilmadi")
    
    game.completed = True
    game.total_time_spent = total_time_spent
    game.completed_at = datetime.utcnow()
    
    # Parvandachi (winner) aniqlash
    if game.team1_score > game.team2_score:
        game.winner = "team1"
    elif game.team2_score > game.team1_score:
        game.winner = "team2"
    else:
        game.winner = "draw"
    
    db.commit()
    db.refresh(game)
    return game

@router.get("/{game_id}", response_model=TeamGameProgressSchema)
async def get_team_game(
    game_id: int,
    db: Session = Depends(get_db)
):
    """Jamoaviy o'yin ma'lumotlarini olish"""
    
    game = db.query(TeamGameProgress).filter(TeamGameProgress.id == game_id).first()
    if not game:
        raise HTTPException(status_code=404, detail="O'yin topilmadi")
    
    return game

@router.get("/section/{game_name}/{section_number}", response_model=List[TeamGameProgressSchema])
async def get_section_results(
    game_name: str,
    section_number: int,
    db: Session = Depends(get_db)
):
    """Bo'limning o'yin natijalari"""
    
    results = db.query(TeamGameProgress).filter(
        TeamGameProgress.game_name == game_name,
        TeamGameProgress.section_number == section_number,
        TeamGameProgress.completed == True
    ).order_by(TeamGameProgress.completed_at.desc()).all()
    
    return results

@router.get("/game/{game_name}/all-results", response_model=List[TeamGameResult])
async def get_game_results(
    game_name: str,
    db: Session = Depends(get_db)
):
    """Barcha o'yinni natijalari"""
    
    results = db.query(TeamGameProgress).filter(
        TeamGameProgress.game_name == game_name,
        TeamGameProgress.completed == True
    ).all()
    
    return [
        {
            "game_name": r.game_name,
            "section_number": r.section_number,
            "difficulty": r.difficulty,
            "team1_score": r.team1_score,
            "team2_score": r.team2_score,
            "winner": r.winner,
            "total_time_spent": r.total_time_spent
        }
        for r in results
    ]

@router.get("/stats/{game_name}", response_model=dict)
async def get_team_game_stats(
    game_name: str,
    difficulty: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Jamoaviy o'yning statistikasi"""
    
    query = db.query(TeamGameProgress).filter(
        TeamGameProgress.game_name == game_name,
        TeamGameProgress.completed == True
    )
    
    if difficulty:
        query = query.filter(TeamGameProgress.difficulty == difficulty)
    
    games = query.all()
    
    if not games:
        return {
            "game_name": game_name,
            "total_games": 0,
            "team1_wins": 0,
            "team2_wins": 0,
            "draws": 0,
            "avg_team1_score": 0,
            "avg_team2_score": 0
        }
    
    team1_wins = sum(1 for g in games if g.winner == "team1")
    team2_wins = sum(1 for g in games if g.winner == "team2")
    draws = sum(1 for g in games if g.winner == "draw")
    
    avg_team1 = sum(g.team1_score for g in games) / len(games)
    avg_team2 = sum(g.team2_score for g in games) / len(games)
    
    return {
        "game_name": game_name,
        "total_games": len(games),
        "team1_wins": team1_wins,
        "team2_wins": team2_wins,
        "draws": draws,
        "avg_team1_score": round(avg_team1, 2),
        "avg_team2_score": round(avg_team2, 2)
    }

@router.delete("/{game_id}")
async def delete_team_game(
    game_id: int,
    db: Session = Depends(get_db)
):
    """Jamoaviy o'yni o'chirish (admin uchun)"""
    
    game = db.query(TeamGameProgress).filter(TeamGameProgress.id == game_id).first()
    if not game:
        raise HTTPException(status_code=404, detail="O'yin topilmadi")
    
    db.delete(game)
    db.commit()
    
    return {"message": "O'yin o'chirildi"}
