from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import test as models
from app.schemas import test as schemas
from app.auth.auth import get_current_user
from typing import List

router = APIRouter(
    prefix="/tests",
    tags=["tests"]
)

# Subject endpoints
@router.post("/subjects/", response_model=schemas.Subject)
def create_subject(subject: schemas.SubjectCreate, db: Session = Depends(get_db)):
    db_subject = models.Subject(name=subject.name)
    db.add(db_subject)
    db.commit()
    db.refresh(db_subject)
    return db_subject

@router.get("/subjects/", response_model=List[schemas.Subject])
def get_subjects(db: Session = Depends(get_db)):
    return db.query(models.Subject).all()

# Test endpoints
@router.post("/", response_model=schemas.Test)
def create_test(
    test: schemas.TestCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    # If section_id provided, validate it
    if test.section_id:
        section = db.query(models.Section).filter(models.Section.id == test.section_id).first()
        if not section:
            raise HTTPException(status_code=404, detail="Section not found")
        
        # Check test limit in section (20 tests per section)
        test_count = db.query(models.Test).filter(models.Test.section_id == test.section_id).count()
        if test_count >= 20:
            raise HTTPException(status_code=400, detail="Section test limit reached (max 20)")
    
    db_test = models.Test(
        title=test.title,
        subject_id=test.subject_id,
        teacher_name=current_user.get("username", "unknown"),
        section_id=test.section_id,
        difficulty=test.difficulty
    )
    db.add(db_test)
    db.commit()
    db.refresh(db_test)
    
    for q in test.questions:
        db_question = models.Question(text=q.text, correct_option=q.correct_option, test_id=db_test.id)
        db.add(db_question)
        db.commit()
        db.refresh(db_question)
        for opt in q.options:
            db_option = models.Option(text=opt.text, question_id=db_question.id)
            db.add(db_option)
        db.commit()
    
    db.refresh(db_test)
    return db_test

@router.get("/", response_model=List[schemas.Test])
def get_tests(
    subject_id: int = Query(None),
    section_id: int = Query(None),
    db: Session = Depends(get_db)
):
    """Get tests, optionally filtered by subject or section"""
    query = db.query(models.Test)
    
    if subject_id:
        query = query.filter(models.Test.subject_id == subject_id)
    
    if section_id:
        query = query.filter(models.Test.section_id == section_id)
    
    return query.all()

@router.get("/{test_id}", response_model=schemas.Test)
def get_test(test_id: int, db: Session = Depends(get_db)):
    db_test = db.query(models.Test).filter(models.Test.id == test_id).first()
    if not db_test:
        raise HTTPException(status_code=404, detail="Test not found")
    return db_test
