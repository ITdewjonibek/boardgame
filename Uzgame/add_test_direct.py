"""
BARABAN uchun test to'g'ridan-to'g'ri database-ga qo'shish
"""
from app.database import sessionLocal
from app.models.test import Subject, Test, Question, Option

def add_test_to_baraban(name: str, title: str, question_text: str, options: list, correct_index: int):
    """
    Test qo'shish function
    
    Args:
        name: Isim (Subject)
        title: Test nomи
        question_text: Savol
        options: Javob variantlari (list)
        correct_index: To'g'ri javobning indexи (0, 1, 2, yoki 3)
    """
    db = sessionLocal()
    
    try:
        # 1. Subject topish yoki yaratish
        subject = db.query(Subject).filter(Subject.name.ilike(name)).first()
        if not subject:
            print(f"⚠️ Isim '{name}' topilmadi. Yarating:")
            subjects = db.query(Subject).all()
            for s in subjects:
                print(f"  - {s.name}")
            return False
        
        print(f"✅ Subject topildi: {subject.name}")
        
        # 2. Test yaratish
        test = Test(
            game_key="baraban",
            title=title,
            teacher_name=name,
            subject_id=subject.id
        )
        db.add(test)
        db.commit()
        db.refresh(test)
        print(f"✅ Test yaratildi: {test.id}")
        
        # 3. Savol yaratish
        question = Question(
            test_id=test.id,
            text=question_text,
            correct_option=correct_index
        )
        db.add(question)
        db.commit()
        db.refresh(question)
        print(f"✅ Savol yaratildi: {question.id}")
        
        # 4. Variantlarni qo'shish
        for idx, option_text in enumerate(options):
            option = Option(
                question_id=question.id,
                text=option_text
            )
            db.add(option)
        db.commit()
        print(f"✅ {len(options)} ta variant qo'shildi")
        
        print(f"\n✅ TEST MUVAFFAQIYATLI QO'SHILDI!")
        print(f"   Isim: {subject.name}")
        print(f"   Test: {title}")
        print(f"   Savol: {question_text}")
        print(f"   Variantlar: {options}")
        print(f"   To'g'ri javob: {options[correct_index]}")
        
        return True
        
    except Exception as e:
        print(f"❌ Xatolik: {e}")
        import traceback
        traceback.print_exc()
        db.rollback()
        return False
    finally:
        db.close()


if __name__ == "__main__":
    # Test 1: Aydin uchun
    add_test_to_baraban(
        name="Aydin",
        title="Tabiiy Fanlar",
        question_text="O'zbekiston qaysi kontinentda joylashgan?",
        options=["Afrika", "Osiyo", "Amerika", "Yevropa"],
        correct_index=1  # "Osiyo"
    )
    
    print("\n" + "="*50 + "\n")
    
    # Test 2: Aziza uchun
    add_test_to_baraban(
        name="Aziza",
        title="Tarix",
        question_text="O'zbekiston qaysi yilda mustaqil bo'ldi?",
        options=["1990", "1991", "1992", "1993"],
        correct_index=1  # "1991"
    )
