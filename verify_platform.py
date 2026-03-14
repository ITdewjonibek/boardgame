#!/usr/bin/env python3
"""
Nebula Pro Platform - Health Check Script
Verifies backend is properly configured and ready
"""

import sys
import requests
import json
from time import sleep

API_URL = "http://localhost:8000"

def check_health():
    """Check if backend is running"""
    try:
        response = requests.get(f"{API_URL}/health")
        if response.status_code == 200:
            print("✅ Backend is running")
            print(f"   {response.json()}")
            return True
        else:
            print("❌ Backend returned unexpected status:", response.status_code)
            return False
    except Exception as e:
        print(f"❌ Cannot connect to backend: {e}")
        print(f"   Make sure backend is running on {API_URL}")
        return False

def check_games():
    """Check if games are loaded"""
    try:
        response = requests.get(f"{API_URL}/games")
        if response.status_code == 200:
            games = response.json()
            print(f"✅ Games loaded: {len(games)} total")
            
            pro_games = [g for g in games if g.get('section') == 'pro']
            subject_games = [g for g in games if g.get('section') == 'subject']
            
            print(f"   Pro games: {len(pro_games)}")
            print(f"   Subject games: {len(subject_games)}")
            
            if len(pro_games) == 15 and len(subject_games) == 10:
                print("✅ All 25 games present")
                return True
            else:
                print(f"⚠️  Expected 25 games (15 pro + 10 subject), got {len(games)}")
                return False
        else:
            print("❌ Failed to load games:", response.status_code)
            return False
    except Exception as e:
        print(f"❌ Error checking games: {e}")
        return False

def check_default_tests():
    """Check if default test sets exist"""
    try:
        response = requests.get(f"{API_URL}/games")
        games = response.json()
        
        all_have_tests = True
        missing = []
        
        for game in games[:5]:  # Check first 5 as sample
            game_key = game.get('key')
            sets_response = requests.get(f"{API_URL}/game-tests/sets/{game_key}")
            
            if sets_response.status_code == 200:
                sets = sets_response.json()
                if len(sets) > 0:
                    default_set = next((s for s in sets if s.get('is_default')), None)
                    if default_set:
                        # Check question count
                        questions_response = requests.get(
                            f"{API_URL}/game-tests/questions/{default_set['id']}"
                        )
                        if questions_response.status_code == 200:
                            questions = questions_response.json()
                            if len(questions) == 20:
                                print(f"✅ {game_key}: default set with {len(questions)} questions")
                            else:
                                print(f"⚠️  {game_key}: default set has {len(questions)} questions (expected 20)")
                                all_have_tests = False
                        else:
                            print(f"❌ {game_key}: cannot load questions")
                            all_have_tests = False
                    else:
                        print(f"❌ {game_key}: no default test set")
                        missing.append(game_key)
                        all_have_tests = False
                else:
                    print(f"❌ {game_key}: no test sets")
                    missing.append(game_key)
                    all_have_tests = False
            else:
                print(f"❌ {game_key}: cannot load test sets ({sets_response.status_code})")
                all_have_tests = False
        
        if all_have_tests:
            print("✅ Sample games have valid default test sets")
        return all_have_tests
        
    except Exception as e:
        print(f"❌ Error checking tests: {e}")
        return False

def check_multiplayer():
    """Check if multiplayer room creation works"""
    try:
        response = requests.post(
            f"{API_URL}/ws/rooms/create",
            params={"game_key": "logic-grid"}
        )
        if response.status_code == 200:
            data = response.json()
            room_code = data.get('room_code')
            if room_code:
                print(f"✅ Multiplayer room created: {room_code}")
                return True
            else:
                print("❌ No room code in response")
                return False
        else:
            print(f"❌ Failed to create room: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Error checking multiplayer: {e}")
        return False

def main():
    print("\n" + "="*60)
    print("Nebula Pro Platform - Health Check")
    print("="*60 + "\n")
    
    # Wait for backend to be ready
    print("Checking backend connectivity...\n")
    max_retries = 5
    for i in range(max_retries):
        if check_health():
            break
        if i < max_retries - 1:
            print(f"Retrying in 2 seconds... ({i+1}/{max_retries-1})")
            sleep(2)
    else:
        print("\n❌ Backend is not responding. Please start it with:")
        print("   npm run dev:server")
        return 1
    
    print("\nChecking games...\n")
    has_games = check_games()
    
    print("\nChecking default test sets...\n")
    has_tests = check_default_tests()
    
    print("\nChecking multiplayer...\n")
    has_multiplayer = check_multiplayer()
    
    print("\n" + "="*60)
    if has_games and has_tests and has_multiplayer:
        print("✅ ALL CHECKS PASSED - Platform is ready!")
        print("="*60)
        print("\nFrontend: http://localhost:5173")
        print("Backend:  http://localhost:8000")
        print("Games:    http://localhost:5173/games")
        return 0
    else:
        print("❌ Some checks failed - see above for details")
        print("="*60)
        return 1

if __name__ == "__main__":
    sys.exit(main())
