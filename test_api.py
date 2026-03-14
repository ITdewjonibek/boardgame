import requests
import json

BASE_URL = "http://localhost:8000"

def test_add_test():
    url = f"{BASE_URL}/api/game-tests/"
    payload = {
        "game_key": "aimind-v5",
        "title": "API Verification Test",
        "teacher_name": "Antigravity",
        "questions": [
            {
                "text": "Does this API work?",
                "correct_option": 0,
                "explanation": "Yes, it does.",
                "difficulty": "easy",
                "options": ["Yes", "No", "Maybe", "Never"]
            }
        ]
    }
    
    # We might need a token if it's protected.
    # But usually game-tests endpoint in this project uses a simplified flow or we can skip for now.
    try:
        res = requests.post(url, json=payload, timeout=5)
        print(f"Status: {res.status_code}")
        print(f"Response: {res.text}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_add_test()
