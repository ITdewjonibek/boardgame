#!/usr/bin/env python3
import sys
sys.path.insert(0, r'c:\react Jonibek\vite-project\Uzgame')

from app.database import sessionLocal, engine, Base
from app.models.user import User
from app.auth.auth import get_password_hash

# Create tables
Base.metadata.create_all(bind=engine)

# Create session
db = sessionLocal()

# Check if user exists
existing_user = db.query(User).filter(User.username == "testuser").first()
if existing_user:
    print(f"✓ User 'testuser' already exists")
    db.close()
    sys.exit(0)

# Create new user
hashed_password = get_password_hash("password123")
new_user = User(
    email="test@example.com",
    username="testuser",
    hashed_password=hashed_password,
    is_active=True
)

db.add(new_user)
db.commit()
db.refresh(new_user)

print(f"✓ User 'testuser' created successfully")
print(f"  Email: test@example.com")
print(f"  Username: testuser")
print(f"  Password: password123")

db.close()
