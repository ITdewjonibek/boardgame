import json
import requests

# Test without token
payload = {
    "game_key": "test-game",
    "title": "Test Set",
    "questions": [
        {
            "prompt": "Test question?",
            "options": [{"text": "A"}, {"text": "B"}, {"text": "C"}, {"text": "D"}],
            "correct_index": 0
        }
    ]
}

response = requests.post(
    "http://localhost:8000/api/game-tests/sets",
    json=payload
)

print(f"Status: {response.status_code}")
print(f"Response: {response.json()}")
