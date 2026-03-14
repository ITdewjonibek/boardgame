from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.rooster import RoosterQuestion
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter(prefix="/api/rooster", tags=["rooster"])

# Pydantic Models
class QuestionCreate(BaseModel):
    number: int
    question: str
    options: List[str]
    correctAnswer: int
    category: str

class QuestionResponse(BaseModel):
    id: int
    number: int
    question: str
    options: List[str]
    correctAnswer: int
    category: str
    
    class Config:
        from_attributes = True

# Routes
@router.get("/questions", response_model=List[QuestionResponse])
def get_all_questions(db: Session = Depends(get_db)):
    """Get all rooster runner questions"""
    questions = db.query(RoosterQuestion).order_by(RoosterQuestion.number).all()
    return questions

@router.get("/questions/{question_number}", response_model=QuestionResponse)
def get_question(question_number: int, db: Session = Depends(get_db)):
    """Get a specific question by number"""
    question = db.query(RoosterQuestion).filter(RoosterQuestion.number == question_number).first()
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
    return question

@router.post("/questions", response_model=QuestionResponse)
def create_question(question: QuestionCreate, db: Session = Depends(get_db)):
    """Create a new rooster question"""
    # Check if question already exists
    existing = db.query(RoosterQuestion).filter(RoosterQuestion.number == question.number).first()
    if existing:
        raise HTTPException(status_code=400, detail="Question with this number already exists")
    
    db_question = RoosterQuestion(**question.dict())
    db.add(db_question)
    db.commit()
    db.refresh(db_question)
    return db_question

@router.post("/questions/bulk", response_model=List[QuestionResponse])
def create_bulk_questions(questions: List[QuestionCreate], db: Session = Depends(get_db)):
    """Create multiple rooster questions at once"""
    created_questions = []
    
    for question in questions:
        # Check if exists
        existing = db.query(RoosterQuestion).filter(RoosterQuestion.number == question.number).first()
        if not existing:
            db_question = RoosterQuestion(**question.dict())
            db.add(db_question)
            created_questions.append(db_question)
    
    db.commit()
    for q in created_questions:
        db.refresh(q)
    
    return created_questions

@router.put("/questions/{question_number}", response_model=QuestionResponse)
def update_question(question_number: int, question: QuestionCreate, db: Session = Depends(get_db)):
    """Update an existing rooster question"""
    db_question = db.query(RoosterQuestion).filter(RoosterQuestion.number == question_number).first()
    if not db_question:
        raise HTTPException(status_code=404, detail="Question not found")
    
    for key, value in question.dict().items():
        setattr(db_question, key, value)
    
    db.commit()
    db.refresh(db_question)
    return db_question

@router.delete("/questions/{question_number}")
def delete_question(question_number: int, db: Session = Depends(get_db)):
    """Delete a rooster question"""
    db_question = db.query(RoosterQuestion).filter(RoosterQuestion.number == question_number).first()
    if not db_question:
        raise HTTPException(status_code=404, detail="Question not found")
    
    db.delete(db_question)
    db.commit()
    return {"message": "Question deleted successfully"}

@router.post("/questions/init-defaults")
def initialize_default_questions(db: Session = Depends(get_db)):
    """Initialize database with default rooster questions"""
    # Check if questions already exist
    existing_count = db.query(RoosterQuestion).count()
    if existing_count > 0:
        raise HTTPException(status_code=400, detail="Questions already exist in database")
    
    # Default questions data
    default_questions = [
        # Position 1-10: Math OSON
        {"number": 1, "question": "12+8=?", "options": ["20", "18", "22", "16"], "correctAnswer": 0, "category": "Math"},
        {"number": 2, "question": "25-5=?", "options": ["20", "15", "25", "30"], "correctAnswer": 0, "category": "Math"},
        {"number": 3, "question": "6×3=?", "options": ["18", "16", "20", "15"], "correctAnswer": 0, "category": "Math"},
        {"number": 4, "question": "36÷4=?", "options": ["9", "8", "10", "7"], "correctAnswer": 0, "category": "Math"},
        {"number": 5, "question": "15+7=?", "options": ["22", "20", "24", "19"], "correctAnswer": 0, "category": "Math"},
        {"number": 6, "question": "30-8=?", "options": ["22", "24", "20", "26"], "correctAnswer": 0, "category": "Math"},
        {"number": 7, "question": "5×5=?", "options": ["25", "24", "26", "20"], "correctAnswer": 0, "category": "Math"},
        {"number": 8, "question": "48÷6=?", "options": ["8", "9", "7", "10"], "correctAnswer": 0, "category": "Math"},
        {"number": 9, "question": "18+12=?", "options": ["30", "28", "32", "26"], "correctAnswer": 0, "category": "Math"},
        {"number": 10, "question": "45-15=?", "options": ["30", "28", "32", "25"], "correctAnswer": 0, "category": "Math"},
        
        # Position 11-20: Math O'RTA
        {"number": 11, "question": "23+17=?", "options": ["40", "38", "42", "36"], "correctAnswer": 0, "category": "Math"},
        {"number": 12, "question": "56-24=?", "options": ["32", "34", "30", "28"], "correctAnswer": 0, "category": "Math"},
        {"number": 13, "question": "8×7=?", "options": ["56", "54", "58", "50"], "correctAnswer": 0, "category": "Math"},
        {"number": 14, "question": "84÷7=?", "options": ["12", "10", "14", "11"], "correctAnswer": 0, "category": "Math"},
        {"number": 15, "question": "35+28=?", "options": ["63", "61", "65", "58"], "correctAnswer": 0, "category": "Math"},
        {"number": 16, "question": "75-32=?", "options": ["43", "45", "41", "47"], "correctAnswer": 0, "category": "Math"},
        {"number": 17, "question": "9×8=?", "options": ["72", "70", "74", "68"], "correctAnswer": 0, "category": "Math"},
        {"number": 18, "question": "96÷8=?", "options": ["12", "10", "14", "11"], "correctAnswer": 0, "category": "Math"},
        {"number": 19, "question": "42+39=?", "options": ["81", "79", "83", "76"], "correctAnswer": 0, "category": "Math"},
        {"number": 20, "question": "100-35=?", "options": ["65", "63", "67", "60"], "correctAnswer": 0, "category": "Math"},
        
        # Position 21-30: Math MEDIUM-HARD
        {"number": 21, "question": "47+36=?", "options": ["83", "81", "85", "78"], "correctAnswer": 0, "category": "Math"},
        {"number": 22, "question": "128-47=?", "options": ["81", "83", "79", "85"], "correctAnswer": 0, "category": "Math"},
        {"number": 23, "question": "12×9=?", "options": ["108", "106", "110", "100"], "correctAnswer": 0, "category": "Math"},
        {"number": 24, "question": "144÷12=?", "options": ["12", "10", "14", "11"], "correctAnswer": 0, "category": "Math"},
        {"number": 25, "question": "(15+25)×2=?", "options": ["80", "78", "82", "75"], "correctAnswer": 0, "category": "Math"},
        {"number": 26, "question": "(60-20)÷4=?", "options": ["10", "8", "12", "9"], "correctAnswer": 0, "category": "Math"},
        {"number": 27, "question": "13×8=?", "options": ["104", "102", "106", "100"], "correctAnswer": 0, "category": "Math"},
        {"number": 28, "question": "7² (7 squared)=?", "options": ["49", "47", "51", "45"], "correctAnswer": 0, "category": "Math"},
        {"number": 29, "question": "√144=?", "options": ["12", "10", "14", "11"], "correctAnswer": 0, "category": "Math"},
        {"number": 30, "question": "(50+30)-20=?", "options": ["60", "58", "62", "55"], "correctAnswer": 0, "category": "Math"},
        
        # Position 31-40: Math QIYIN
        {"number": 31, "question": "17×13=?", "options": ["221", "215", "227", "210"], "correctAnswer": 0, "category": "Math"},
        {"number": 32, "question": "√256=?", "options": ["16", "14", "18", "15"], "correctAnswer": 0, "category": "Math"},
        {"number": 33, "question": "(12×15)+35=?", "options": ["215", "210", "220", "205"], "correctAnswer": 0, "category": "Math"},
        {"number": 34, "question": "13²=?", "options": ["169", "165", "173", "160"], "correctAnswer": 0, "category": "Math"},
        {"number": 35, "question": "√289=?", "options": ["17", "15", "19", "16"], "correctAnswer": 0, "category": "Math"},
        {"number": 36, "question": "3⁵ (3 to power 5)=?", "options": ["243", "240", "247", "236"], "correctAnswer": 0, "category": "Math"},
        {"number": 37, "question": "(25×8)-40=?", "options": ["160", "158", "162", "155"], "correctAnswer": 0, "category": "Math"},
        {"number": 38, "question": "4⁴ (4 to power 4)=?", "options": ["256", "250", "262", "248"], "correctAnswer": 0, "category": "Math"},
        {"number": 39, "question": "√361=?", "options": ["19", "17", "21", "18"], "correctAnswer": 0, "category": "Math"},
        {"number": 40, "question": "(100÷5)+45=?", "options": ["65", "63", "67", "60"], "correctAnswer": 0, "category": "Math"},
        
        # Position 41-50: Math HARD
        {"number": 41, "question": "(75-35)÷8=?", "options": ["5", "6", "4", "7"], "correctAnswer": 0, "category": "Math"},
        {"number": 42, "question": "11×14=?", "options": ["154", "150", "158", "146"], "correctAnswer": 0, "category": "Math"},
        {"number": 43, "question": "√400=?", "options": ["20", "18", "22", "19"], "correctAnswer": 0, "category": "Math"},
        {"number": 44, "question": "(100÷5)×3=?", "options": ["60", "58", "62", "55"], "correctAnswer": 0, "category": "Math"},
        {"number": 45, "question": "15×4=?", "options": ["60", "58", "62", "56"], "correctAnswer": 0, "category": "Math"},
        {"number": 46, "question": "(48+32)÷10=?", "options": ["8", "6", "10", "7"], "correctAnswer": 0, "category": "Math"},
        {"number": 47, "question": "19×6=?", "options": ["114", "110", "118", "112"], "correctAnswer": 0, "category": "Math"},
        {"number": 48, "question": "√225=?", "options": ["15", "13", "17", "14"], "correctAnswer": 0, "category": "Math"},
        {"number": 49, "question": "(200÷4)+50=?", "options": ["100", "98", "102", "95"], "correctAnswer": 0, "category": "Math"},
        {"number": 50, "question": "6×30=?", "options": ["180", "175", "185", "170"], "correctAnswer": 0, "category": "Math"},
        
        # Position 51-60: Math VERY HARD
        {"number": 51, "question": "23×17=?", "options": ["391", "385", "397", "380"], "correctAnswer": 0, "category": "Math"},
        {"number": 52, "question": "√529=?", "options": ["23", "21", "25", "22"], "correctAnswer": 0, "category": "Math"},
        {"number": 53, "question": "(150-30)÷6=?", "options": ["20", "18", "22", "19"], "correctAnswer": 0, "category": "Math"},
        {"number": 54, "question": "14²=?", "options": ["196", "190", "202", "185"], "correctAnswer": 0, "category": "Math"},
        {"number": 55, "question": "∛27 (cube root)=?", "options": ["3", "2", "4", "5"], "correctAnswer": 0, "category": "Math"},
        {"number": 56, "question": "(250+150)÷8=?", "options": ["50", "48", "52", "45"], "correctAnswer": 0, "category": "Math"},
        {"number": 57, "question": "18×12=?", "options": ["216", "210", "222", "205"], "correctAnswer": 0, "category": "Math"},
        {"number": 58, "question": "√484=?", "options": ["22", "20", "24", "21"], "correctAnswer": 0, "category": "Math"},
        {"number": 59, "question": "(100-40)×2=?", "options": ["120", "118", "122", "115"], "correctAnswer": 0, "category": "Math"},
        {"number": 60, "question": "16×15=?", "options": ["240", "235", "245", "230"], "correctAnswer": 0, "category": "Math"},
        
        # Position 61-70: Math EXTREME
        {"number": 61, "question": "29×19=?", "options": ["551", "545", "557", "540"], "correctAnswer": 0, "category": "Math"},
        {"number": 62, "question": "√625=?", "options": ["25", "23", "27", "24"], "correctAnswer": 0, "category": "Math"},
        {"number": 63, "question": "(300÷12)+25=?", "options": ["50", "48", "52", "45"], "correctAnswer": 0, "category": "Math"},
        {"number": 64, "question": "15²=?", "options": ["225", "220", "230", "215"], "correctAnswer": 0, "category": "Math"},
        {"number": 65, "question": "2⁸ (2 to power 8)=?", "options": ["256", "250", "262", "248"], "correctAnswer": 0, "category": "Math"},
        {"number": 66, "question": "(400-160)÷8=?", "options": ["30", "28", "32", "26"], "correctAnswer": 0, "category": "Math"},
        {"number": 67, "question": "21×13=?", "options": ["273", "265", "281", "260"], "correctAnswer": 0, "category": "Math"},
        {"number": 68, "question": "√900=?", "options": ["30", "28", "32", "29"], "correctAnswer": 0, "category": "Math"},
        {"number": 69, "question": "(150+90)÷6=?", "options": ["40", "38", "42", "36"], "correctAnswer": 0, "category": "Math"},
        {"number": 70, "question": "25×14=?", "options": ["350", "345", "355", "340"], "correctAnswer": 0, "category": "Math"},
        
        # Position 71-80: Math MASTER LEVEL
        {"number": 71, "question": "37×23=?", "options": ["851", "845", "857", "840"], "correctAnswer": 0, "category": "Math"},
        {"number": 72, "question": "√1024=?", "options": ["32", "30", "34", "31"], "correctAnswer": 0, "category": "Math"},
        {"number": 73, "question": "(500÷10)-15=?", "options": ["35", "33", "37", "30"], "correctAnswer": 0, "category": "Math"},
        {"number": 74, "question": "12×18=?", "options": ["216", "210", "222", "205"], "correctAnswer": 0, "category": "Math"},
        {"number": 75, "question": "3⁶ (3 to power 6)=?", "options": ["729", "720", "738", "710"], "correctAnswer": 0, "category": "Math"},
        {"number": 76, "question": "(600-240)÷9=?", "options": ["40", "38", "42", "36"], "correctAnswer": 0, "category": "Math"},
        {"number": 77, "question": "32×17=?", "options": ["544", "540", "548", "535"], "correctAnswer": 0, "category": "Math"},
        {"number": 78, "question": "√1600=?", "options": ["40", "38", "42", "39"], "correctAnswer": 0, "category": "Math"},
        {"number": 79, "question": "(250+250)÷5=?", "options": ["100", "98", "102", "95"], "correctAnswer": 0, "category": "Math"},
        {"number": 80, "question": "(100-25)×3=?", "options": ["225", "220", "230", "215"], "correctAnswer": 0, "category": "Math"},
        
        # Position 81-90: Math ULTIMATE CHALLENGE
        {"number": 81, "question": "43×29=?", "options": ["1247", "1240", "1254", "1235"], "correctAnswer": 0, "category": "Math"},
        {"number": 82, "question": "√1296=?", "options": ["36", "34", "38", "35"], "correctAnswer": 0, "category": "Math"},
        {"number": 83, "question": "(720÷18)+30=?", "options": ["70", "68", "72", "65"], "correctAnswer": 0, "category": "Math"},
        {"number": 84, "question": "18×18=?", "options": ["324", "320", "328", "315"], "correctAnswer": 0, "category": "Math"},
        {"number": 85, "question": "5⁵ (5 to power 5)=?", "options": ["3125", "3100", "3150", "3115"], "correctAnswer": 0, "category": "Math"},
        {"number": 86, "question": "(1000÷20)+100=?", "options": ["150", "148", "152", "145"], "correctAnswer": 0, "category": "Math"},
        {"number": 87, "question": "47×21=?", "options": ["987", "980", "994", "975"], "correctAnswer": 0, "category": "Math"},
        {"number": 88, "question": "√1849=?", "options": ["43", "41", "45", "42"], "correctAnswer": 0, "category": "Math"},
        {"number": 89, "question": "(500+500)÷10=?", "options": ["100", "98", "102", "95"], "correctAnswer": 0, "category": "Math"},
        {"number": 90, "question": "(200-50)÷3=?", "options": ["50", "48", "52", "45"], "correctAnswer": 0, "category": "Math"},
        
        # Position 91-100: Math LEGENDARY
        {"number": 91, "question": "53×37=?", "options": ["1961", "1950", "1972", "1940"], "correctAnswer": 0, "category": "Math"},
        {"number": 92, "question": "√2401=?", "options": ["49", "47", "51", "48"], "correctAnswer": 0, "category": "Math"},
        {"number": 93, "question": "(1000÷25)×2=?", "options": ["80", "78", "82", "75"], "correctAnswer": 0, "category": "Math"},
        {"number": 94, "question": "19×32=?", "options": ["608", "600", "616", "595"], "correctAnswer": 0, "category": "Math"},
        {"number": 95, "question": "7⁴ (7 to power 4)=?", "options": ["2401", "2390", "2412", "2380"], "correctAnswer": 0, "category": "Math"},
        {"number": 96, "question": "(1500-300)÷12=?", "options": ["100", "98", "102", "95"], "correctAnswer": 0, "category": "Math"},
        {"number": 97, "question": "59×23=?", "options": ["1357", "1350", "1364", "1345"], "correctAnswer": 0, "category": "Math"},
        {"number": 98, "question": "√3600=?", "options": ["60", "58", "62", "59"], "correctAnswer": 0, "category": "Math"},
        {"number": 99, "question": "(800+400)÷4=?", "options": ["300", "298", "302", "295"], "correctAnswer": 0, "category": "Math"},
        {"number": 100, "question": "🎉 Tabriklaymiz! Siz MATEMATIK CHEMPION bo'ldingiz! 🎉", "options": ["100", "99", "101", "98"], "correctAnswer": 0, "category": "Math"},
    ]
    
    # Add all questions to database
    for q_data in default_questions:
        db_question = RoosterQuestion(**q_data)
        db.add(db_question)
    
    db.commit()
    return {"message": f"Initialized {len(default_questions)} rooster questions"}
