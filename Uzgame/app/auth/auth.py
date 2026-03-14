from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.schemas.userschemas import TokenData
import logging

logger = logging.getLogger(__name__)



SECRET_KEY = "YOUR_SECRET_KEY_HERE"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


def verify_password(plain_password, hashed_password):
    # Bcrypt has a 72-byte limitation, truncate if necessary
    plain_password = plain_password[:72]
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    # Bcrypt has a 72-byte limitation, truncate if necessary
    password = password[:72]
    return pwd_context.hash(password)

def create_access_token(data:dict,expires_delta:timedelta):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow()+expires_delta
    else:
        expire = datetime.utcnow()+timedelta(minutes=15)
    to_encode.update({"exp":expire})
    encoded_jwt = jwt.encode(to_encode,SECRET_KEY,algorithm=ALGORITHM)
    return encoded_jwt

def authenticate_user(db:Session,username:str,password:str):
    import sys
    sys.stderr.write(f"[AUTH] Authenticating user: {username}\n")
    sys.stderr.flush()
    user = db.query(User).filter(User.username == username).first()
    sys.stderr.write(f"[AUTH] User found: {user is not None}\n")
    sys.stderr.flush()
    if not user:
        sys.stderr.write(f"[AUTH] User {username} not found\n")
        sys.stderr.flush()
        return False
    sys.stderr.write(f"[AUTH] Verifying password\n")
    sys.stderr.flush()
    is_valid = verify_password(password,user.hashed_password)
    sys.stderr.write(f"[AUTH] Password valid: {is_valid}\n")
    sys.stderr.flush()
    if not is_valid:
        return False
    return user

async def get_current_user(token:str = Depends(oauth2_scheme),db:Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"www-Authenticate": "Bearer"},

    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except JWTError:
        raise credentials_exception
    user = db.query(User).filter(User.username == token_data.username).first()
    if user is None:
        raise credentials_exception
    return user

async def get_optional_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            return None
        user = db.query(User).filter(User.username == username).first()
        return user
    except JWTError:
        return None


async def get_optional_user_no_token_required(request, db: Session = Depends(get_db)):
    """
    Optional user - accepts requests without token and returns None.
    For endpoints that should work both authenticated and unauthenticated.
    """
    # Try to get token from Authorization header
    auth_header = request.headers.get("Authorization")
    if not auth_header:
        return None
    
    try:
        # Extract token from "Bearer <token>"
        token = auth_header.replace("Bearer ", "")
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            return None
        user = db.query(User).filter(User.username == username).first()
        return user
    except (JWTError, Exception):
        return None



