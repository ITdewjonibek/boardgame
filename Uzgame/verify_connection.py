import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.models.user import User

load_dotenv()

DB_NAME = os.getenv("DB_NAME")
DB_USER = os.getenv("DB_USER")
DB_HOST = os.getenv("DB_HOST")
DATABASE_URL = os.getenv("DATABASE_URL")


engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)
db = SessionLocal()

users = db.query(User).all()

print(f"DATABASE: {DB_NAME}", flush=True)
print(f"Total Users: {len(users)}", flush=True)
for user in users:
    print(f"User: {user.id} | {user.username} | {user.email}", flush=True)

db.close()
