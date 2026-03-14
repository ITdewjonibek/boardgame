#!/usr/bin/env python3
import sys
sys.path.insert(0, r'c:\react Jonibek\vite-project\Uzgame')

from app.database import sessionLocal
from app.models.user import User
from app.auth.auth import verify_password

db = sessionLocal()

# Get the test user
user = db.query(User).filter(User.username == "testuser").first()

if user:
    print(f"✓ User found: {user.username}")
    print(f"  Email: {user.email}")
    print(f"  Hashed Password: {user.hashed_password[:30]}...")
    
    # Test password verification
    test_password = "password123"
    is_valid = verify_password(test_password, user.hashed_password)
    print(f"  Password '{test_password}' is valid: {is_valid}")
else:
    print("✗ User not found")

db.close()
