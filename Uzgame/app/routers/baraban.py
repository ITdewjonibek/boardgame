from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import random
from datetime import datetime

from app.database import get_db
from app.models import test as test_models
from pydantic import BaseModel

router = APIRouter(prefix="/api/baraban", tags=["baraban"])

# ===== PYDANTIC SCHEMAS =====
class OptionSchema(BaseModel):
    id: int
    text: str

    class Config:
        from_attributes = True


class QuestionSchema(BaseModel):
    id: int
    prompt: str
    correct_index: int
    difficulty: str
    options: List[OptionSchema]

    class Config:
        from_attributes = True


class PersonDataResponse(BaseModel):
    name: str
    questions: List[QuestionSchema]


class NameListResponse(BaseModel):
    names: List[str]


class GameResultRequest(BaseModel):
    name: str
    score: int
    total_questions: int
    timestamp: str


class GameResultResponse(BaseModel):
    id: int
    name: str
    score: int
    total_questions: int
    timestamp: str

    class Config:
        from_attributes = True


# ===== DATABASE MODEL FOR RESULTS =====
# (Foydalanuvchi baraban o'yini natijalari uchun model)
from sqlalchemy import Column, Integer, String, DateTime, Float

class BarabanResult(test_models.Base):
    __tablename__ = "baraban_results"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), index=True)
    score = Column(Integer)
    total_questions = Column(Integer)
    timestamp = Column(DateTime, default=datetime.utcnow)


# ===== API ENDPOINTS =====

@router.get("/names", response_model=NameListResponse)
def get_all_names(db: Session = Depends(get_db)):
    """
    Baraban o'yini uchun barcha unik isimlarni olish
    (Subject nomlaridan olinadi)
    """
    try:
        # Subjectlarni isim sifatida ishlatamiz
        subjects = db.query(test_models.Subject).all()
        names = [subject.name for subject in subjects if subject.name]
        
        if not names:
            # Agar subject bo'lmasa, test teacher_name larini olamiz
            tests = db.query(test_models.Test).distinct(test_models.Test.teacher_name).all()
            names = [test.teacher_name for test in tests if test.teacher_name]
        
        return {"names": names}
    except Exception as e:
        print(f"Xatolik names olishda: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/random-person", response_model=PersonDataResponse)
def get_random_person(db: Session = Depends(get_db)):
    """
    Random isim tanlash va shu isimga tegishli BARABAN testlarni olish
    """
    try:
        # Barcha subjectlarni olish
        subjects = db.query(test_models.Subject).all()
        
        if not subjects:
            raise HTTPException(
                status_code=404,
                detail="Database da subject topilmadi"
            )
        
        # Random subject (isim) tanlash
        random_subject = random.choice(subjects)
        selected_name = random_subject.name
        
        # Shu subjectga tegishli BARABAN testlarni olish
        # Barcha testlarni ko'rsatish - game_key filter yo'q
        tests = db.query(test_models.Test)\
            .filter(test_models.Test.subject_id == random_subject.id)\
            .all()
        
        if not tests:
            raise HTTPException(
                status_code=404,
                detail=f"{selected_name} uchun test topilmadi"
            )
        
        # Barcha savollarni yig'ish
        all_questions = []
        for test in tests:
            questions = db.query(test_models.Question)\
                .filter(test_models.Question.test_id == test.id)\
                .all()
            
            for question in questions:
                options = db.query(test_models.Option)\
                    .filter(test_models.Option.question_id == question.id)\
                    .all()
                
                all_questions.append({
                    "id": question.id,
                    "prompt": question.text,
                    "correct_index": question.correct_option if question.correct_option is not None else 0,
                    "difficulty": getattr(question, 'difficulty', 'medium'),
                    "options": [
                        {
                            "id": option.id,
                            "text": option.text
                        }
                        for option in options
                    ]
                })
        
        if not all_questions:
            raise HTTPException(
                status_code=404,
                detail=f"{selected_name} uchun savol topilmadi"
            )
        
        # Random tartiblashda 10 ta savol tanlash
        selected_questions = random.sample(all_questions, min(10, len(all_questions)))
        
        print(f"✅ BARABAN: {selected_name} - {len(selected_questions)} ta savol loaded")
        
        return {
            "name": selected_name,
            "questions": selected_questions
        }
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"Xatolik random_person da: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/person/{name}", response_model=PersonDataResponse)
def get_person_by_name(name: str, db: Session = Depends(get_db)):
    """
    Aniq isim bo'yicha subject va testlarni olish
    """
    try:
        # Isim bo'yicha subject topish
        subject = db.query(test_models.Subject)\
            .filter(test_models.Subject.name.ilike(name))\
            .first()
        
        if not subject:
            raise HTTPException(
                status_code=404,
                detail=f"Isim '{name}' topilmadi"
            )
        
        # Shu subjectga tegishli testlarni olish
        tests = db.query(test_models.Test)\
            .filter(test_models.Test.subject_id == subject.id)\
            .all()
        
        if not tests:
            raise HTTPException(
                status_code=404,
                detail=f"'{name}' uchun test topilmadi"
            )
        
        # Barcha savollarni yig'ish
        all_questions = []
        for test in tests:
            questions = db.query(test_models.Question)\
                .filter(test_models.Question.test_id == test.id)\
                .all()
            
            for question in questions:
                options = db.query(test_models.Option)\
                    .filter(test_models.Option.question_id == question.id)\
                    .all()
                
                all_questions.append({
                    "id": question.id,
                    "prompt": question.text,
                    "correct_index": question.correct_option if question.correct_option is not None else 0,
                    "difficulty": getattr(question, 'difficulty', 'medium'),
                    "options": [
                        {
                            "id": option.id,
                            "text": option.text
                        }
                        for option in options
                    ]
                })
        
        # 10 ta random savol tanlash
        selected_questions = random.sample(all_questions, min(10, len(all_questions)))
        
        return {
            "name": subject.name,
            "questions": selected_questions
        }
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"Xatolik person olishda: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/save-result", response_model=GameResultResponse)
def save_game_result(
    result: GameResultRequest,
    db: Session = Depends(get_db)
):
    """
    Baraban o'yini natijalari uchun
    """
    try:
        # Natijallarni database ga saqlash
        db_result = BarabanResult(
            name=result.name,
            score=result.score,
            total_questions=result.total_questions,
            timestamp=datetime.fromisoformat(result.timestamp)
        )
        db.add(db_result)
        db.commit()
        db.refresh(db_result)
        
        return {
            "id": db_result.id,
            "name": db_result.name,
            "score": db_result.score,
            "total_questions": db_result.total_questions,
            "timestamp": db_result.timestamp.isoformat()
        }
    except Exception as e:
        print(f"Xatolik natijalani saqlashda: {e}")
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/results/{name}")
def get_person_results(name: str, db: Session = Depends(get_db)):
    """
    Isim bo'yicha barcha natijalani olish
    """
    try:
        results = db.query(BarabanResult)\
            .filter(BarabanResult.name.ilike(name))\
            .all()
        
        if not results:
            return {"name": name, "results": [], "total_attempts": 0}
        
        total_score = sum(r.score for r in results)
        avg_score = total_score / len(results) if results else 0
        
        return {
            "name": name,
            "results": [
                {
                    "id": r.id,
                    "score": r.score,
                    "total_questions": r.total_questions,
                    "percentage": (r.score / r.total_questions * 100) if r.total_questions > 0 else 0,
                    "timestamp": r.timestamp.isoformat()
                }
                for r in results
            ],
            "total_attempts": len(results),
            "average_score": round(avg_score, 2),
            "best_score": max(r.score for r in results) if results else 0
        }
    except Exception as e:
        print(f"Xatolik natijalani olishda: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/leaderboard")
def get_leaderboard(db: Session = Depends(get_db), limit: int = 10):
    """
    Top o'yinchilarni ko'rsatish
    """
    try:
        # Har bir isimning eng yaxshi natijalasini olish
        from sqlalchemy import func
        
        results = db.query(
            BarabanResult.name,
            func.max(BarabanResult.score).label('best_score'),
            func.avg(BarabanResult.score).label('avg_score'),
            func.count(BarabanResult.id).label('attempts')
        ).group_by(BarabanResult.name)\
         .order_by(func.max(BarabanResult.score).desc())\
         .limit(limit)\
         .all()
        
        return [
            {
                "rank": idx + 1,
                "name": r[0],
                "best_score": r[1],
                "average_score": round(float(r[2]), 2),
                "attempts": r[3]
            }
            for idx, r in enumerate(results)
        ]
    except Exception as e:
        print(f"Xatolik leaderboardni olishda: {e}")
        raise HTTPException(status_code=500, detail=str(e))


class AddTestRequest(BaseModel):
    title: str
    questions_data: List[dict]


@router.post("/add-test/{name}")
def add_test_to_person(
    name: str,
    request: AddTestRequest,
    db: Session = Depends(get_db)
):
    """
    BARABAN o'yini uchun person ga test qo'shish
    """
    print(f"\n📥 ADD-TEST REQUEST:")
    print(f"  Name: {name}")
    print(f"  Request body: {request}")
    print(f"  Title: {request.title}")
    print(f"  Questions: {request.questions_data}")
    
    try:
        # Isim bo'yicha subject topish
        subject = db.query(test_models.Subject)\
            .filter(test_models.Subject.name.ilike(name))\
            .first()
        
        if not subject:
            raise HTTPException(
                status_code=404,
                detail=f"Isim '{name}' topilmadi"
            )
        
        # Test yaratish
        test_obj = test_models.Test(
            game_key="baraban",
            title=request.title,
            teacher_name=name,
            subject_id=subject.id
        )
        db.add(test_obj)
        db.commit()
        db.refresh(test_obj)
        
        # Savollarni qo'shish
        for q_data in request.questions_data:
            question = test_models.Question(
                test_id=test_obj.id,
                text=q_data.get("text", "Savol"),
                correct_option=q_data.get("correct_index", 0)
            )
            db.add(question)
            db.commit()
            db.refresh(question)
            
            # Variantlarni qo'shish
            for option_text in q_data.get("options", []):
                option = test_models.Option(
                    question_id=question.id,
                    text=option_text
                )
                db.add(option)
            db.commit()
        
        return {
            "success": True,
            "message": f"Test muvaffaqiyatli qo'shildi: {request.title}",
            "test_id": test_obj.id
        }
    except HTTPException as e:
        print(f"❌ HTTPException: {e}")
        raise
    except Exception as e:
        print(f"❌ Exception in add-test: {e}")
        import traceback
        traceback.print_exc()
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
