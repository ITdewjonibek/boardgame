"""Insert subjects directly into database"""
import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from app.database import sessionLocal, engine, Base
from app.models.test import Subject

print("Creating tables...")
Base.metadata.create_all(bind=engine)

print("Opening database connection...")
db = sessionLocal()

subjects_list = [
    "Matematika",
    "Fizika", 
    "Kimyo",
    "Biologiya",
    "O'zbek tili",
    "Ingliz tili",
    "Tarix",
    "Geografia",
]

print("Inserting subjects...")
for subj_name in subjects_list:
    # Check if already exists
    existing = db.query(Subject).filter(Subject.name == subj_name).first()
    if not existing:
        new_subject = Subject(name=subj_name)
        db.add(new_subject)
        print(f"  Added: {subj_name}")
    else:
        print(f"  Already exists: {subj_name}")

db.commit()
print("Committed changes")

# Verify
all_subjects = db.query(Subject).all()
print(f"\nTotal subjects in database: {len(all_subjects)}")
for s in all_subjects:
    print(f"  ID {s.id}: {s.name}")

db.close()
print("Done!")
