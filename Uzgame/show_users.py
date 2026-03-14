import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, desc
from sqlalchemy.orm import sessionmaker
from app.models.user import User

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")
DB_NAME = os.getenv("DB_NAME")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)
db = SessionLocal()

print(f"\n⚡ CONNECTION: {DB_NAME}")
print("="*40)

# Get last 5 users
users = db.query(User).order_by(desc(User.id)).limit(5).all()

if not users:
    print("❌ No users found!")
else:
    for user in users:
        print(f"✅ ID: {user.id} | USER: {user.username} | EMAIL: {user.email}")

print("="*40)
print("Agar bu ro'yxatda o'zingizni ko'rsangiz, demak bazada borsiz!\n")
