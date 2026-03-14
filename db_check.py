import os
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

# Try to load env from the suspected backend
backend_env = r"C:\my-project-breakfast-figma\Totcbecend\.env"
load_dotenv(backend_env)

DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "5432")
DB_USER = os.getenv("DB_USER", "postgres")
DB_PASS = os.getenv("DB_PASS", "jonibek")
DB_NAME = os.getenv("DB_NAME", "mening_loyiha_db")

DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASS}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
print(f"Checking Database: {DATABASE_URL}")

engine = create_engine(DATABASE_URL)

try:
    with engine.connect() as conn:
        # Check if 'test' table exists
        result = conn.execute(text("SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'test');"))
        exists = result.scalar()
        print(f"Table 'test' exists: {exists}")
        
        if not exists:
            print("CRITICAL: 'test' table is MISSING. The backend needs a restart or migration.")
        
        # Check if 'questions' table exists
        result = conn.execute(text("SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'questions');"))
        print(f"Table 'questions' exists: {result.scalar()}")

except Exception as e:
    print(f"DB CONNECTION ERROR: {e}")
