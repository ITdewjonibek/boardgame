#!/usr/bin/env python3
"""
BARABAN o'yini uchun test ma'lumotlarini database ga kiritish script
Isimlar va ularga tegishli savollarni qo'shadi
"""

from app.database import sessionLocal
from app.models import test as test_models
import random

def seed_baraban_data():
    """
    Baraban o'yini uchun test ma'lumotlarini qo'sh
    """
    db = sessionLocal()
    
    try:
        # Isimlar (Subjectlar sifatida)
        names = [
            "Islom",
            "Aydin",
            "Aziza",
            "Nodira",
            "Kamol",
            "Madina",
            "Rashid",
            "Farida",
            "Hamid",
            "Saodat",
            "Abdullaev",
            "Karimova"
        ]
        
        # Har bir isim uchun subject yarat
        for name in names:
            # Existon subject ni tekshir
            existing = db.query(test_models.Subject).filter(
                test_models.Subject.name == name
            ).first()
            
            if not existing:
                subject = test_models.Subject(name=name)
                db.add(subject)
                db.commit()
                db.refresh(subject)
                print(f"✓ Subject qo'shildi: {name}")
            else:
                subject = existing
                print(f"~ Subject allaqachon bor: {name}")
        
        # Har bir subject uchun test va savollarni qo'sh
        test_data = {
            "Islom": [
                {
                    "title": "Islomiy o'quv",
                    "questions": [
                        {
                            "text": "Islomning asosiy shahādasi nima?",
                            "options": ["Alloh yagona", "Muhammad Allohning rasuli", "Alloh yagona va Muhammad Allohning rasuli", "Dunyoda xudo yok"],
                            "correct": 2
                        },
                        {
                            "text": "Namozning necha bo'limi bor?",
                            "options": ["3 ta", "4 ta", "5 ta", "6 ta"],
                            "correct": 2
                        }
                    ]
                }
            ],
            "Aydin": [
                {
                    "title": "Tabiiy fanlar",
                    "questions": [
                        {
                            "text": "Quyosh sistemaning eng katta sayyorasi?",
                            "options": ["Zemlya", "Neptun", "Yupiter", "Saturn"],
                            "correct": 2
                        },
                        {
                            "text": "Suv qaysi temperaturada qaynaydi?",
                            "options": ["90°C", "100°C", "110°C", "120°C"],
                            "correct": 1
                        }
                    ]
                }
            ],
            "Aziza": [
                {
                    "title": "Matematika asoslari",
                    "questions": [
                        {
                            "text": "5 + 7 = ?",
                            "options": ["11", "12", "13", "14"],
                            "correct": 0
                        },
                        {
                            "text": "15 × 3 = ?",
                            "options": ["35", "40", "45", "50"],
                            "correct": 2
                        }
                    ]
                }
            ],
            "Nodira": [
                {
                    "title": "Adabiyot",
                    "questions": [
                        {
                            "text": "\"Devoni Lug'at-it-turk\" kim yozgan?",
                            "options": ["Firdavsi", "Mahmud Qashg'ariy", "Ibn Sino", "At-Termiziy"],
                            "correct": 1
                        },
                        {
                            "text": "Alisher Navoi qaysi asrda yasashgan?",
                            "options": ["XIII asr", "XIV asr", "XV asr", "XVI asr"],
                            "correct": 2
                        }
                    ]
                }
            ],
            "Kamol": [
                {
                    "title": "Tarix",
                    "questions": [
                        {
                            "text": "O'zbekiston neche yildan mustaqil?",
                            "options": ["1989", "1990", "1991", "1992"],
                            "correct": 2
                        },
                        {
                            "text": "Temur Lenk qaysi shaharda tug'ilgan?",
                            "options": ["Buxoro", "Samarqand", "Xiva", "Qo'qon"],
                            "correct": 1
                        }
                    ]
                }
            ],
            "Madina": [
                {
                    "title": "Biologiya",
                    "questions": [
                        {
                            "text": "Inson tanasida necha ta suyak bor?",
                            "options": ["150 ta", "180 ta", "206 ta", "250 ta"],
                            "correct": 2
                        },
                        {
                            "text": "Yurak necha kamera bor?",
                            "options": ["2 ta", "3 ta", "4 ta", "5 ta"],
                            "correct": 2
                        }
                    ]
                }
            ],
            "Rashid": [
                {
                    "title": "Geografiya",
                    "questions": [
                        {
                            "text": "Dunyo qaysi sayyora?",
                            "options": ["1-chi", "2-chi", "3-chi", "4-chi"],
                            "correct": 2
                        },
                        {
                            "text": "Eng katta okean?",
                            "options": ["Atlantika", "Tikhii", "Indian", "Arklik"],
                            "correct": 1
                        }
                    ]
                }
            ],
            "Farida": [
                {
                    "title": "Fizika",
                    "questions": [
                        {
                            "text": "Nur tezligi necha m/s?",
                            "options": ["1000000", "100000", "300000000", "3000000"],
                            "correct": 2
                        },
                        {
                            "text": "Gravitatsion kuch nimaning ta'siri?",
                            "options": ["Magnit", "Massa", "Elektr", "Ishqalanish"],
                            "correct": 1
                        }
                    ]
                }
            ],
            "Hamid": [
                {
                    "title": "Kimyo",
                    "questions": [
                        {
                            "text": "Suv qanday formulada yoziladi?",
                            "options": ["H2O", "CO2", "O2", "N2"],
                            "correct": 0
                        },
                        {
                            "text": "Periodlar jadvali kim tuzgan?",
                            "options": ["Bohr", "Rutherford", "Mendeleev", "Planck"],
                            "correct": 2
                        }
                    ]
                }
            ],
            "Saodat": [
                {
                    "title": "Informatika",
                    "questions": [
                        {
                            "text": "Bitta bayt necha bitdan iborat?",
                            "options": ["4", "8", "16", "32"],
                            "correct": 1
                        },
                        {
                            "text": "Python qaysi turdagi tildir?",
                            "options": ["Kompilyator", "Interpretator", "Assambler", "Linker"],
                            "correct": 1
                        }
                    ]
                }
            ],
            "Abdullaev": [
                {
                    "title": "Iqtisodiyot",
                    "questions": [
                        {
                            "text": "Iqtisodiyotning asosiy masalasi?",
                            "options": ["Harajat", "Talab va taklif", "Narx", "Ishchi"],
                            "correct": 1
                        },
                        {
                            "text": "Pul qanday funksiya bajaradi?",
                            "options": ["Savatchi", "Almashtiruv vositasi", "Qoldirig'i", "Hisobi"],
                            "correct": 1
                        }
                    ]
                }
            ],
            "Karimova": [
                {
                    "title": "Falsafa",
                    "questions": [
                        {
                            "text": "Falsafaning asosiy savoli?",
                            "options": ["Inson kim?", "Dunyo nima?", "Ilm nima?", "Yaxshi nima?"],
                            "correct": 1
                        },
                        {
                            "text": "Sharq falsafasining asoschisi?",
                            "options": ["Al-Kindi", "Al-Farabi", "Ibn Sino", "Al-Gazaliy"],
                            "correct": 1
                        }
                    ]
                }
            ]
        }
        
        # Test va savollarni qo'sh
        for subject_name, tests in test_data.items():
            subject = db.query(test_models.Subject).filter(
                test_models.Subject.name == subject_name
            ).first()
            
            if not subject:
                continue
                
            for test_item in tests:
                # Existing test tekshir
                existing_test = db.query(test_models.Test).filter(
                    test_models.Test.title == test_item["title"],
                    test_models.Test.subject_id == subject.id
                ).first()
                
                if not existing_test:
                    test_obj = test_models.Test(
                        game_key="baraban",
                        title=test_item["title"],
                        teacher_name=subject_name,
                        subject_id=subject.id
                    )
                    db.add(test_obj)
                    db.commit()
                    db.refresh(test_obj)
                    print(f"✓ Test qo'shildi: {subject_name} - {test_item['title']}")
                else:
                    test_obj = existing_test
                    print(f"~ Test allaqachon bor: {subject_name} - {test_item['title']}")
                
                # Savollarni qo'sh
                for question_item in test_item["questions"]:
                    existing_q = db.query(test_models.Question).filter(
                        test_models.Question.test_id == test_obj.id,
                        test_models.Question.text == question_item["text"]
                    ).first()
                    
                    if not existing_q:
                        question = test_models.Question(
                            test_id=test_obj.id,
                            text=question_item["text"],
                            correct_option=question_item["correct"]
                        )
                        db.add(question)
                        db.commit()
                        db.refresh(question)
                        print(f"  ✓ Savol qo'shildi")
                        
                        # Variantlarni qo'sh
                        for idx, option_text in enumerate(question_item["options"]):
                            option = test_models.Option(
                                question_id=question.id,
                                text=option_text
                            )
                            db.add(option)
                        db.commit()
                    else:
                        print(f"  ~ Savol allaqachon bor")
        
        print("\n✅ Baraban ma'lumotlari muvaffaqiyatli kiritildi!")
        
    except Exception as e:
        print(f"❌ Xatolik: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    seed_baraban_data()
