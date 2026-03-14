import os
import sys
from pathlib import Path
from dotenv import load_dotenv
from sqlalchemy import create_engine, text

# Uzgame papkasini sys.path ga qo'shish
sys.path.append(str(Path(__file__).resolve().parent / "Uzgame"))

# .env fayllarni yuklash
root_env = Path(".env")
uzgame_env = Path("Uzgame/.env")

print(f"Checking root .env: {root_env.exists()}")
print(f"Checking Uzgame .env: {uzgame_env.exists()}")

# Uzgame dagi .env ni yuklaymiz (ustuvor)
load_dotenv(dotenv_path=uzgame_env)

DATABASE_URL = os.getenv("DATABASE_URL")
print(f"Using DATABASE_URL: {DATABASE_URL}")

try:
    engine = create_engine(DATABASE_URL)
    with engine.connect() as conn:
        res = conn.execute(text("SELECT current_database(), current_user")).fetchone()
        print(f"SUCCESS! Connected to Database: {res[0]} as User: {res[1]}")
        
        # Jadvallarni tekshirish
        tables = conn.execute(text("SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname = 'public'")).fetchall()
        print(f"Tables found: {[t[0] for t in tables]}")
        
        if 'users' in [t[0] for t in tables]:
            users_count = conn.execute(text("SELECT count(*) FROM users")).scalar()
            print(f"Users count in 'users' table: {users_count}")
except Exception as e:
    print(f"ERROR: {e}")
