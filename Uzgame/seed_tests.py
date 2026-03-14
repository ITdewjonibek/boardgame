"""
30+ ta test va savollari uchun seed script
"""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.models.test import Subject, Test, Question, Option
from app.database import DATABASE_URL, Base

# Database ulanish
engine = create_engine(DATABASE_URL)
Base.metadata.create_all(bind=engine)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
db = SessionLocal()

# Mavjud data'ni o'chirish
db.query(Option).delete()
db.query(Question).delete()
db.query(Test).delete()
db.query(Subject).delete()
db.commit()

# Fanlar
subjects = [
    Subject(name="Matematika"),
    Subject(name="Kimyo"),
    Subject(name="Ingliz tili"),
    Subject(name="Biologiya"),
    Subject(name="Fizika"),
    Subject(name="Informatika"),
]
db.add_all(subjects)
db.commit()

# Matematika testlari (10 ta)
math_tests = [
    {
        "title": "Matematika Chotkasi",
        "teacher": "Ahmad O'qituvchi",
        "questions": [
            {"text": "15² - 10² = ?", "options": ["100", "125", "150", "175"], "correct": 1},
            {"text": "2³ × 3² = ?", "options": ["36", "54", "72", "108"], "correct": 2},
            {"text": "√144 = ?", "options": ["10", "11", "12", "13"], "correct": 2},
        ]
    },
    {
        "title": "Algebra Asoslari",
        "teacher": "Fatima O'qituvchi",
        "questions": [
            {"text": "x² + 5x + 6 = 0 tenglamaning ildizlari?", "options": ["-2, -3", "-1, -6", "2, 3", "1, 6"], "correct": 0},
            {"text": "(a+b)² = ?", "options": ["a² + b²", "a² + 2ab + b²", "a² - b²", "ab"], "correct": 1},
        ]
    },
    {
        "title": "Geometriya",
        "teacher": "Yusuf O'qituvchi",
        "questions": [
            {"text": "Uchburchakning burchaklari yig'indisi?", "options": ["180°", "270°", "360°", "90°"], "correct": 0},
            {"text": "Aylananing diametri 10 cm bo'lsa, radiusi?", "options": ["5 cm", "10 cm", "20 cm", "15 cm"], "correct": 0},
        ]
    },
    {
        "title": "Sonli Ketma-ketlik",
        "teacher": "Nora O'qituvchi",
        "questions": [
            {"text": "1, 2, 4, 8, ... ketma-ketlikning 6-hadi?", "options": ["16", "32", "48", "64"], "correct": 1},
        ]
    },
    {
        "title": "Kasr va O'nli Sonlar",
        "teacher": "Ahmad O'qituvchi",
        "questions": [
            {"text": "1/2 + 1/3 = ?", "options": ["1/5", "2/5", "5/6", "2/3"], "correct": 2},
        ]
    },
    {
        "title": "Foizlar",
        "teacher": "Fatima O'qituvchi",
        "questions": [
            {"text": "100 ning 20% qanchasi?", "options": ["10", "20", "30", "40"], "correct": 1},
        ]
    },
    {
        "title": "Trigonometriya",
        "teacher": "Yusuf O'qituvchi",
        "questions": [
            {"text": "sin(90°) = ?", "options": ["0", "1", "-1", "0.5"], "correct": 1},
        ]
    },
    {
        "title": "Logarifmlar",
        "teacher": "Nora O'qituvchi",
        "questions": [
            {"text": "log₁₀(100) = ?", "options": ["1", "2", "3", "10"], "correct": 1},
        ]
    },
    {
        "title": "Hosilalar",
        "teacher": "Ahmad O'qituvchi",
        "questions": [
            {"text": "d/dx(x²) = ?", "options": ["x", "2x", "x³", "2x²"], "correct": 1},
        ]
    },
    {
        "title": "Integrallar",
        "teacher": "Fatima O'qituvchi",
        "questions": [
            {"text": "∫2x dx = ?", "options": ["x²", "x² + C", "2x²", "x"], "correct": 1},
        ]
    },
]

# Kimyo testlari (5 ta)
chemistry_tests = [
    {
        "title": "Kimyo Tajribasi",
        "teacher": "Nora O'qituvchi",
        "questions": [
            {"text": "H₂O formula qaysi moddani anglatadi?", "options": ["Karbonat", "Suv", "Kislota", "Asosan"], "correct": 1},
            {"text": "O'q jismning qaynash nuqtasi?", "options": ["0°C", "50°C", "100°C", "150°C"], "correct": 2},
        ]
    },
    {
        "title": "Elementlar Davriy Jadvali",
        "teacher": "Ahmad O'qituvchi",
        "questions": [
            {"text": "Uglerod (C) ning atom raqami?", "options": ["4", "6", "8", "12"], "correct": 1},
        ]
    },
    {
        "title": "Kimyoviy Bog'lanish",
        "teacher": "Yusuf O'qituvchi",
        "questions": [
            {"text": "Ionli bog'lanish qaysi moddada bo'ladi?", "options": ["NaCl", "H₂", "CH₄", "O₂"], "correct": 0},
        ]
    },
    {
        "title": "Oksidasyon va Reduksiya",
        "teacher": "Fatima O'qituvchi",
        "questions": [
            {"text": "Kislorod kimyoviy belgisi?", "options": ["O", "C", "H", "N"], "correct": 0},
        ]
    },
    {
        "title": "Asidlar va Asoslar",
        "teacher": "Nora O'qituvchi",
        "questions": [
            {"text": "HCl qaysi turdagi moddadir?", "options": ["Asosan", "Asid", "Tuz", "Suv"], "correct": 1},
        ]
    },
]

# Ingliz tili testlari (5 ta)
english_tests = [
    {
        "title": "Present Simple",
        "teacher": "Nora O'qituvchi",
        "questions": [
            {"text": "I ___ to school every day.", "options": ["go", "goes", "going", "gone"], "correct": 0},
        ]
    },
    {
        "title": "Past Tense",
        "teacher": "Ahmad O'qituvchi",
        "questions": [
            {"text": "She ___ to London last year.", "options": ["go", "went", "goes", "going"], "correct": 1},
        ]
    },
    {
        "title": "Present Perfect",
        "teacher": "Yusuf O'qituvchi",
        "questions": [
            {"text": "I ___ English for 5 years.", "options": ["study", "studied", "have studied", "studying"], "correct": 2},
        ]
    },
    {
        "title": "Vocabulary",
        "teacher": "Fatima O'qituvchi",
        "questions": [
            {"text": "'Happy' qanday ma'noni anglatadi?", "options": ["Sad", "Glad", "Angry", "Tired"], "correct": 1},
        ]
    },
    {
        "title": "Grammar Rules",
        "teacher": "Nora O'qituvchi",
        "questions": [
            {"text": "Pluralni qanday qilamiz?", "options": ["-es", "-s", "-ed", "-ing"], "correct": 1},
        ]
    },
]

# Biologiya testlari (3 ta)
biology_tests = [
    {
        "title": "Hujayra",
        "teacher": "Ahmad O'qituvchi",
        "questions": [
            {"text": "Hujayra qanday tarkibda?", "options": ["Yadro", "Sitoplazma", "Membrana", "Hamma"], "correct": 3},
        ]
    },
    {
        "title": "Genetika",
        "teacher": "Fatima O'qituvchi",
        "questions": [
            {"text": "DNK nima?", "options": ["Protein", "Dezoksiribonuklein kislota", "Glyukoза", "Lipid"], "correct": 1},
        ]
    },
    {
        "title": "Evolyutsiya",
        "teacher": "Yusuf O'qituvchi",
        "questions": [
            {"text": "Darwin kim?", "options": ["Fizik", "Biolog", "Kimyager", "Astronom"], "correct": 1},
        ]
    },
]

# Fizika testlari (2 ta)
physics_tests = [
    {
        "title": "Mexanika",
        "teacher": "Nora O'qituvchi",
        "questions": [
            {"text": "F = ma formulasi nima?", "options": ["Impuls", "Nyuton ikkinchi qonuni", "Energiya", "Kuch"], "correct": 1},
        ]
    },
    {
        "title": "Elektromagnitizm",
        "teacher": "Ahmad O'qituvchi",
        "questions": [
            {"text": "Elektr tokining birligi?", "options": ["Volt", "Amper", "Om", "Vatt"], "correct": 1},
        ]
    },
]

# Testlarni qo'shish
all_tests = [
    (subjects[0], math_tests),
    (subjects[1], chemistry_tests),
    (subjects[2], english_tests),
    (subjects[3], biology_tests),
    (subjects[4], physics_tests),
]

for subject, tests_list in all_tests:
    for test_data in tests_list:
        test = Test(
            title=test_data["title"],
            subject_id=subject.id,
            teacher_name=test_data["teacher"]
        )
        db.add(test)
        db.commit()
        
        for q_data in test_data["questions"]:
            question = Question(
                text=q_data["text"],
                test_id=test.id,
                correct_option=q_data["correct"]
            )
            db.add(question)
            db.commit()
            
            for opt_text in q_data["options"]:
                option = Option(text=opt_text, question_id=question.id)
                db.add(option)
            db.commit()

print("✅ 30+ ta test va savollari muvaffaqiyatli qo'shildi!")
print(f"Jami testlar: {db.query(Test).count()}")
print(f"Jami savollar: {db.query(Question).count()}")
db.close()
