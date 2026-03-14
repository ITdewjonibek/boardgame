import requests
import json

# Test data
payload = {
    "title": "O'zbek tarixi",
    "questions_data": [
        {
            "text": "O'zbekiston qaysi yildan mustaqil?",
            "correct_index": 0,
            "options": ["1991", "1992", "1993", "1994"]
        }
    ]
}

# Send request
url = "http://localhost:8000/api/baraban/add-test/Islom"
response = requests.post(url, json=payload)

print(f"Status Code: {response.status_code}")
print(f"Response: {json.dumps(response.json(), indent=2)}")

# Check database
from app.database import sessionLocal
from app.models.test import Test, Question, Option

db = sessionLocal()
tests = db.query(Test).filter(Test.game_key == "baraban").all()
print(f"\nDatabase check:")
print(f"Total BARABAN tests: {len(tests)}")

for test in tests[-1:]:  # Show last test
    questions = db.query(Question).filter(Question.test_id == test.id).all()
    print(f"  Test: {test.title} - {len(questions)} questions")
    for q in questions:
        options = db.query(Option).filter(Option.question_id == q.id).all()
        print(f"    Q: {q.text} ({len(options)} options)")

db.close()
