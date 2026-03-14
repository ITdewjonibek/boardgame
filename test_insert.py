import os
import sys
from pathlib import Path
from dotenv import load_dotenv
from sqlalchemy import create_engine, text

# Uzgame papkasini sys.path ga qo'shish
sys.path.append(str(Path(__file__).resolve().parent / "Uzgame"))

# Uzgame dagi .env ni yuklaymiz
load_dotenv(dotenv_path="Uzgame/.env")

DATABASE_URL = os.getenv("DATABASE_URL")
print(f"Connecting to: {DATABASE_URL}")

try:
    from app.database import sessionlocal
    from app.models.user import User
    
    db = sessionlocal()
    
    # Test user yaratish
    test_email = "bot_test@example.com"
    
    # Eskisini o'chirish (toza test uchun)
    db.query(User).filter(User.email == test_email).delete()
    
    new_user = User(
        email=test_email,
        username="bot_tester",
        hashed_password="hashed_placeholder",
        is_active=True
    )
    
    db.add(new_user)
    db.commit()
    print(f"SUCCESS: Test user '{test_email}' added to database!")
    
    # Tekshirish
    count = db.query(User).count()
    print(f"Total users in database now: {count}")
    
except Exception as e:
    print(f"ERROR: {e}")
finally:
    db.close()
