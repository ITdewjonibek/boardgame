"""Seed subjects into the database"""
from app.database import sessionLocal, engine, Base
from app.models.test import Subject, Test, Question, Option

# Create all tables
Base.metadata.create_all(bind=engine)

db = sessionLocal()

# List of subjects
subjects = [
    {"name": "Matematika"},
    {"name": "Fizika"},
    {"name": "Kimyo"},
    {"name": "Biologiya"},
    {"name": "O'zbek tili"},
    {"name": "Ingliz tili"},
    {"name": "Tarix"},
    {"name": "Geografia"},
]

try:
    for subj in subjects:
        existing = db.query(Subject).filter(Subject.name == subj["name"]).first()
        if not existing:
            new_subject = Subject(name=subj["name"])
            db.add(new_subject)
            print(f"Adding subject: {subj['name']}")
        else:
            print(f"Subject already exists: {subj['name']}")
    
    db.commit()
    print("✅ Subjects seeded successfully!")
    
    # Verify
    all_subjects = db.query(Subject).all()
    print(f"Total subjects in DB: {len(all_subjects)}")
    for s in all_subjects:
        print(f"  - {s.name} (ID: {s.id})")
        
except Exception as e:
    print(f"❌ Error: {e}")
    db.rollback()
finally:
    db.close()
