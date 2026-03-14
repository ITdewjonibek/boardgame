#!/usr/bin/env python3
import requests
import json

# Register user via API
response = requests.post(
    "http://127.0.0.1:8000/register",
    json={
        "email": "test@example.com",
        "username": "testuser",
        "password": "password123"
    }
)

print(f"Status: {response.status_code}")
print(f"Response: {response.json()}")

# Now try to login
login_response = requests.post(
    "http://127.0.0.1:8000/token",
    data={
        "username": "testuser",
        "password": "password123"
    }
)

print(f"\nLogin Status: {login_response.status_code}")
print(f"Login Response: {login_response.json()}")
