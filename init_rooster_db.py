#!/usr/bin/env python3
"""
Initialize Rooster Runner questions in the database.
Run this script once to populate the database with all 100 math questions.
"""

import requests
import sys

# Backend API URL
API_URL = "http://127.0.0.1:8000/api/rooster/questions/init-defaults"

def initialize_database():
    """Call the init endpoint to populate the database with all 100 questions"""
    try:
        print("🚀 Rooster Runner database ni ishga tushirmoqda...")
        response = requests.post(API_URL)
        
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Muvaffaqiyat! {result.get('message', 'Database ishga tushirildi.')}")
            print(f"📊 Qo'shilgan savollar: {result.get('created_count', '100')}")
            return True
        else:
            print(f"❌ Xato ({response.status_code}): {response.text}")
            return False
    except requests.exceptions.ConnectionError:
        print("❌ Xato: Backend server (127.0.0.1:8000) ga ulanib bo'lmadi.")
        print("💡 Maslaha: Uzgame/app/main.py fayl orqali FastAPI serverni ishga tushiring:")
        print("   python -m uvicorn app.main:app --reload")
        return False
    except Exception as e:
        print(f"❌ Noma'lum xato: {str(e)}")
        return False

if __name__ == "__main__":
    success = initialize_database()
    sys.exit(0 if success else 1)
