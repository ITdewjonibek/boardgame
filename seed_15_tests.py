import os
import sys
import random
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

# Path to the backend directory
BACKEND_PATH = r"C:\my-project-breakfast-figma\Totcbecend"
load_dotenv(os.path.join(BACKEND_PATH, ".env"))

DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "5432")
DB_USER = os.getenv("DB_USER", "postgres")
DB_PASS = os.getenv("DB_PASS", "jonibek")
DB_NAME = os.getenv("DB_NAME", "postgres") # Based on .env

DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASS}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
print(f"Targeting Database: {DATABASE_URL}")

engine = create_engine(DATABASE_URL)

GAMES = [
    # Top Tier V5
    'probability-v5', 'tugofwar-v5-physics', 'speedquiz-v5', 'aimind-v5', 
    'memory-v5', 'math-v5', 'cipher-v5', 'quantum-logic', 'chain-v5',
    'logic-master', 'battle-wits', 'molecular-lab',
    # Legacy/Secondary
    'word_search', 'country', 'champion', 'speed_round', 'crossword', 
    'biggest', 'cosmic-quiz', 'verbal-quest'
]

QUESTION_TEMPLATES = {
    'math': [
        ("What is {a} + {b}?", ["{sum}", "{sum_p1}", "{sum_m1}", "{sum_p10}"], 0, "Basic addition."),
        ("Calculate {a} * {b}.", ["{prod_m5}", "{prod}", "{prod_p5}", "{prod_m2}"], 1, "Multiplication logic."),
        ("Solve for x: x - {a} = {b}.", ["{diff}", "{sum}", "{prod}", "{sum_p1}"], 1, "Algebraic isolation."),
        ("Square root of {sq_val}?", ["{root_m1}", "{root}", "{root_p1}", "{root_p2}"], 1, "Exponential reverse."),
        ("What is 15% of {val}?", ["{res}", "{res_p5}", "{res_m5}", "{res_p2}"], 0, "Percentage calculation.")
    ],
    'logic': [
        ("If all A are B, and all B are C, then:", ["All A are C", "Some A are not C", "No A is C", "C is A"], 0, "Syllogistic logic."),
        ("Which number comes next: 2, 4, 8, 16, ...?", ["24", "30", "32", "64"], 2, "Powers of two."),
        ("A is taller than B. B is taller than C. Who is tallest?", ["A", "B", "C", "Equal"], 0, "Transitive property."),
        ("Find the odd one out:", ["Apple", "Orange", "Hammer", "Banana"], 2, "Semantic category fail."),
        ("If today is Monday, what is 3 days after tomorrow?", ["Thursday", "Friday", "Saturday", "Wednesday"], 1, "Temporal offset.")
    ],
    'tech': [
        ("What does HTML stand for?", ["HyperText Markup Language", "HighTech Modern Language", "Hyperlink Text Mall", "Home Tool Markup"], 0, "Web standards."),
        ("Primary function of a CPU?", ["Graphics rendering", "Data processing", "Long-term storage", "Power supply"], 1, "Hardware core."),
        ("Which is a NoSQL database?", ["PostgreSQL", "MySQL", "MongoDB", "Oracle"], 2, "Data architecture."),
        ("What is 'Python' in tech?", ["A snake", "A programming language", "A firewall", "A browser"], 1, "Software dev."),
        ("Meaning of 'Open Source'?", ["Free to edit", "Closed to public", "Only for Windows", "Encrypted source"], 0, "Software licensing.")
    ]
}

def generate_questions(category):
    questions = []
    templates = QUESTION_TEMPLATES.get(category, QUESTION_TEMPLATES['logic'])
    
    for i in range(15):
        tpl = random.choice(templates)
        q_text, opts, corr, expl = tpl
        
        # Randomize values
        a, b = random.randint(10, 50), random.randint(1, 10)
        sq_val = random.choice([16, 25, 36, 49, 64, 81, 100])
        root = int(sq_val**0.5)
        val = random.randint(100, 500)
        
        # Fill template
        q_formatted = q_text.format(a=a, b=b, sum=a+b, sum_p1=a+b+1, sum_m1=a+b-1, sum_p10=a+b+10,
                                     prod=a*b, prod_m5=a*b-5, prod_p5=a*b+5, prod_m2=a*b-2,
                                     diff=b+a if 'x -' in q_text else a-b, 
                                     sq_val=sq_val, root=root, root_m1=root-1, root_p1=root+1, root_p2=root+2,
                                     val=val, res=val*0.15, res_p5=val*0.15+5, res_m5=val*0.15-5, res_p2=val*0.15+2)
        
        opts_formatted = [o.format(a=a, b=b, sum=a+b, sum_p1=a+b+1, sum_m1=a+b-1, sum_p10=a+b+10,
                                     prod=a*b, prod_m5=a*b-5, prod_p5=a*b+5, prod_m2=a*b-2,
                                     diff=b+a if 'x -' in q_text else a-b,
                                     sq_val=sq_val, root=root, root_m1=root-1, root_p1=root+1, root_p2=root+2,
                                     val=val, res=val*0.15, res_p5=val*0.15+5, res_m5=val*0.15-5, res_p2=val*0.15+2) for o in opts]
        
        questions.append({
            "prompt": q_formatted,
            "options": opts_formatted,
            "correct_index": corr,
            "explanation": expl,
            "difficulty": random.choice(["easy", "medium", "hard"])
        })
    return questions

def seed():
    with engine.begin() as conn:
        print("Cleaning old tests...")
        conn.execute(text("DELETE FROM options CASCADE;"))
        conn.execute(text("DELETE FROM questions CASCADE;"))
        conn.execute(text("DELETE FROM test CASCADE;"))
        
        for game in GAMES:
            print(f"Seeding 15 questions for: {game}")
            
            # Create Test entry
            res = conn.execute(text(
                "INSERT INTO test (game_key, title, teacher_name) VALUES (:gk, :t, :tn) RETURNING id"
            ), {"gk": game, "t": f"Default Assessment - {game}", "tn": "System"})
            test_id = res.scalar()
            
            category = 'math' if 'math' in game or 'prob' in game else 'tech' if 'mind' in game or 'molecular' in game or 'logic' in game else 'logic'
            questions = generate_questions(category)
            
            for q in questions:
                # Create Question
                res_q = conn.execute(text(
                    "INSERT INTO questions (test_id, text, correct_option, explanation, difficulty) "
                    "VALUES (:tid, :txt, :co, :exp, :diff) RETURNING id"
                ), {"tid": test_id, "txt": q['prompt'], "co": q['correct_index'], "exp": q['explanation'], "diff": q['difficulty']})
                question_id = res_q.scalar()
                
                # Create Options
                for opt_text in q['options']:
                    conn.execute(text(
                        "INSERT INTO options (question_id, text) VALUES (:qid, :txt)"
                    ), {"qid": question_id, "txt": opt_text})

    print("SUCCESS: Seeding complete. All games now have 15 default tests.")

if __name__ == "__main__":
    seed()
