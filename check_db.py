from app.database import sessionLocal
from app.models.test import Subject, Test, Question

db = sessionLocal()

# Check all subjects and their tests
subjects = db.query(Subject).all()
print(f"📊 Total subjects: {len(subjects)}\n")

for s in subjects:
    tests = db.query(Test).filter(Test.subject_id == s.id).all()
    questions_count = 0
    for t in tests:
        qs = db.query(Question).filter(Question.test_id == t.id).all()
        questions_count += len(qs)
    
    status = "✓" if len(tests) > 0 and questions_count > 0 else "✗"
    print(f"{status} {s.name}: {len(tests)} tests, {questions_count} questions")
    
db.close()
