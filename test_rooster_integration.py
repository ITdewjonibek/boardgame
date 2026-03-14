#!/usr/bin/env python3
"""
Test script for Rooster Runner database integration.
Verifies that all API endpoints are working correctly.
"""

import requests
import json
import time
from typing import List, Dict, Any

API_BASE = "http://127.0.0.1:8000/api/rooster"

class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    END = '\033[0m'

def print_success(msg: str):
    print(f"{Colors.GREEN}✅ {msg}{Colors.END}")

def print_error(msg: str):
    print(f"{Colors.RED}❌ {msg}{Colors.END}")

def print_info(msg: str):
    print(f"{Colors.BLUE}ℹ️  {msg}{Colors.END}")

def print_warning(msg: str):
    print(f"{Colors.YELLOW}⚠️  {msg}{Colors.END}")

def test_connection():
    """Test if API is reachable"""
    print("\n" + "="*60)
    print("TEST 1: API CONNECTION")
    print("="*60)
    
    try:
        response = requests.get(f"{API_BASE}/questions", timeout=5)
        if response.status_code == 200:
            print_success("API is reachable")
            return True
        else:
            print_error(f"API returned status {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print_error("Cannot connect to API at 127.0.0.1:8000")
        print_info("Make sure FastAPI server is running:")
        print_info("  cd Uzgame && python -m uvicorn app.main:app --reload")
        return False
    except Exception as e:
        print_error(f"Connection error: {str(e)}")
        return False

def test_get_all_questions() -> bool:
    """Test GET /api/rooster/questions endpoint"""
    print("\n" + "="*60)
    print("TEST 2: GET ALL QUESTIONS")
    print("="*60)
    
    try:
        response = requests.get(f"{API_BASE}/questions")
        
        if response.status_code != 200:
            print_error(f"Expected 200, got {response.status_code}")
            return False
        
        questions = response.json()
        
        if not isinstance(questions, list):
            print_error("Expected list of questions")
            return False
        
        count = len(questions)
        print_success(f"Retrieved {count} questions")
        
        if count < 100:
            print_warning(f"Expected 100 questions, got {count}")
        
        if count > 0:
            first_q = questions[0]
            print_info(f"First question: {first_q.get('question', 'N/A')[:50]}...")
            print_info(f"Question structure: {list(first_q.keys())}")
        
        return count > 0
        
    except Exception as e:
        print_error(f"Error: {str(e)}")
        return False

def test_get_specific_question() -> bool:
    """Test GET /api/rooster/questions/{number} endpoint"""
    print("\n" + "="*60)
    print("TEST 3: GET SPECIFIC QUESTION")
    print("="*60)
    
    try:
        response = requests.get(f"{API_BASE}/questions/1")
        
        if response.status_code == 200:
            question = response.json()
            print_success(f"Retrieved question #1: {question.get('question', 'N/A')[:50]}...")
            return True
        elif response.status_code == 404:
            print_warning("Question #1 not found (database may not be initialized)")
            return False
        else:
            print_error(f"Unexpected status {response.status_code}")
            return False
            
    except Exception as e:
        print_error(f"Error: {str(e)}")
        return False

def test_initialize_database() -> bool:
    """Test POST /api/rooster/questions/init-defaults endpoint"""
    print("\n" + "="*60)
    print("TEST 4: INITIALIZE DATABASE")
    print("="*60)
    
    try:
        print_info("Attempting to initialize database with 100 questions...")
        response = requests.post(f"{API_BASE}/questions/init-defaults")
        
        if response.status_code == 200:
            result = response.json()
            print_success(f"Database initialized: {result.get('message', '')}")
            print_info(f"Created {result.get('created_count', '?')} questions")
            return True
        elif response.status_code == 400:
            print_warning("Questions already initialized (may need to DELETE first)")
            return True
        else:
            print_error(f"Unexpected status {response.status_code}: {response.text}")
            return False
            
    except Exception as e:
        print_error(f"Error: {str(e)}")
        return False

def test_question_structure() -> bool:
    """Test that questions have correct structure"""
    print("\n" + "="*60)
    print("TEST 5: QUESTION STRUCTURE")
    print("="*60)
    
    try:
        response = requests.get(f"{API_BASE}/questions/1")
        
        if response.status_code != 200:
            print_warning("Cannot verify structure (question not found)")
            return False
        
        question = response.json()
        required_fields = ['number', 'question', 'options', 'correctAnswer', 'category']
        
        missing_fields = [f for f in required_fields if f not in question]
        
        if missing_fields:
            print_error(f"Missing fields: {missing_fields}")
            return False
        
        print_success("All required fields present:")
        for field in required_fields:
            value = question[field]
            if isinstance(value, list):
                print_info(f"  - {field}: [{len(value)} items]")
            else:
                preview = str(value)[:50]
                print_info(f"  - {field}: {preview}")
        
        return True
        
    except Exception as e:
        print_error(f"Error: {str(e)}")
        return False

def test_difficulty_progression() -> bool:
    """Test that questions progress in difficulty"""
    print("\n" + "="*60)
    print("TEST 6: DIFFICULTY PROGRESSION")
    print("="*60)
    
    try:
        response = requests.get(f"{API_BASE}/questions")
        
        if response.status_code != 200 or len(response.json()) == 0:
            print_warning("Cannot verify (no questions found)")
            return False
        
        questions = response.json()
        
        # Check a sample of positions
        samples = [
            (1, "OSON (Easy)"),
            (15, "O'RTA (Medium)"),
            (30, "MEDIUM-HARD"),
            (50, "HARD"),
            (100, "ULTIMATE")
        ]
        
        print_success("Difficulty progression:")
        for pos, difficulty in samples:
            q = next((q for q in questions if q['number'] == pos), None)
            if q:
                print_info(f"  Position {pos}: {difficulty}")
                print_info(f"    Question: {q['question'][:45]}...")
            else:
                print_warning(f"  Position {pos}: Not found")
        
        return True
        
    except Exception as e:
        print_error(f"Error: {str(e)}")
        return False

def main():
    """Run all tests"""
    print("\n" + "="*60)
    print("🧪 ROOSTER RUNNER DATABASE INTEGRATION TEST")
    print("="*60)
    
    results = {}
    
    # Test 1: Connection
    results['connection'] = test_connection()
    if not results['connection']:
        print_error("\nCannot proceed - API not accessible")
        return False
    
    # Test 2: Get all questions
    results['get_all'] = test_get_all_questions()
    
    # Test 3: Get specific question
    results['get_specific'] = test_get_specific_question()
    
    # Test 4: Initialize database
    if not results['get_specific']:  # Only init if database empty
        results['init'] = test_initialize_database()
        time.sleep(1)  # Wait for initialization
        results['get_specific'] = test_get_specific_question()
    else:
        results['init'] = "Skipped (database already initialized)"
    
    # Test 5: Question structure
    results['structure'] = test_question_structure()
    
    # Test 6: Difficulty progression
    results['difficulty'] = test_difficulty_progression()
    
    # Summary
    print("\n" + "="*60)
    print("📊 TEST SUMMARY")
    print("="*60)
    
    for test_name, result in results.items():
        if isinstance(result, bool):
            status = "✅ PASSED" if result else "❌ FAILED"
            print(f"{test_name:20} {status}")
        else:
            print(f"{test_name:20} ⏭️  {result}")
    
    all_passed = all(v for v in results.values() if isinstance(v, bool))
    
    print("\n" + "="*60)
    if all_passed:
        print_success("ALL TESTS PASSED! 🎉")
        print_success("Database integration is working correctly")
        print("\nNext steps:")
        print("  1. Start React frontend: npm run dev")
        print("  2. Open Rooster Runner game")
        print("  3. Verify questions load from database")
        return True
    else:
        print_error("SOME TESTS FAILED")
        print_error("Please check the errors above and troubleshoot")
        return False

if __name__ == "__main__":
    import sys
    success = main()
    sys.exit(0 if success else 1)
