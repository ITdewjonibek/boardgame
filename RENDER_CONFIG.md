# Render.com Deploy Configuration for Backend

# Environment variables to set in Render dashboard:
# 1. DATABASE_URL = postgresql://user:password@hostname:5432/boardgame
# 2. SECRET_KEY = your-secret-key-here
# 3. ALGORITHM = HS256
# 4. CORS_ORIGINS = ["https://boardgame.vercel.app"]
# 5. ENVIRONMENT = production

# Build command will be:
# pip install -r requirements.txt && python migrate.py

# Start command will be:
# python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
