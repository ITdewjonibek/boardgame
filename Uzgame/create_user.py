from app.database import sessionLocal
from app.models.user import User
from app.auth.auth import get_password_hash

db = sessionLocal()

# Allaqachon mavjud bo'lsa o'chirish
existing = db.query(User).filter(User.username == 'teacher').first()
if existing:
    db.delete(existing)
    db.commit()
    print("Eski user o'chirildi")

# Yangi user qo'shish
new_user = User(
    email='teacher@example.com',
    username='teacher',
    hashed_password=get_password_hash('password123'),
    is_active=True
)
db.add(new_user)
db.commit()
print(" O'qituvchi user yaratildi: teacher / password123")
db.close()
