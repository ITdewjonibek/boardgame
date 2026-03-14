from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.test import Section, Test, Question, Option, Subject
from app.schemas.test import Section as SectionSchema, SectionCreate, Test as TestSchema, TestCreate
from app.auth.auth import get_current_user

router = APIRouter(prefix="/tests/sections", tags=["sections"])

@router.post("/", response_model=SectionSchema)
def create_section(
    section: SectionCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Create a new section for a subject"""
    # Check if subject exists
    subject = db.query(Subject).filter(Subject.id == section.subject_id).first()
    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found")
    
    # Check section limit (3 per teacher)
    existing_sections = db.query(Section).filter(
        Section.teacher_name == current_user.get("username", "unknown"),
        Section.subject_id == section.subject_id
    ).count()
    
    if existing_sections >= 3:
        raise HTTPException(status_code=400, detail="Section limit reached (max 3 per teacher)")
    
    db_section = Section(
        title=section.title,
        subject_id=section.subject_id,
        teacher_name=current_user.get("username", "unknown")
    )
    db.add(db_section)
    db.commit()
    db.refresh(db_section)
    return db_section

@router.get("/{section_id}", response_model=SectionSchema)
def get_section(section_id: int, db: Session = Depends(get_db)):
    """Get a specific section with all tests"""
    section = db.query(Section).filter(Section.id == section_id).first()
    if not section:
        raise HTTPException(status_code=404, detail="Section not found")
    return section

@router.get("/", response_model=list[SectionSchema])
def list_sections(
    subject_id: int = Query(None),
    db: Session = Depends(get_db)
):
    """List all sections, optionally filtered by subject"""
    query = db.query(Section)
    if subject_id:
        query = query.filter(Section.subject_id == subject_id)
    return query.all()

@router.get("/{section_id}/questions")
def get_section_questions(section_id: int, db: Session = Depends(get_db)):
    """Get all questions from tests in a section"""
    section = db.query(Section).filter(Section.id == section_id).first()
    if not section:
        raise HTTPException(status_code=404, detail="Section not found")
    
    questions = []
    for test in section.tests:
        for q in test.questions:
            questions.append({
                "id": q.id,
                "question": q.text,
                "options": [opt.text for opt in q.options],
                "correctIndex": q.correct_option,
                "testId": test.id
            })
    
    return {"questions": questions}
