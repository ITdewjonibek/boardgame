from app.database import sessionLocal, Base, engine
from app.core.seed import seed_data
from app.models.base import User, Game, TestSet, Question, Option

def force_seed():
    print("Forcing Database Initialization...")
    Base.metadata.create_all(bind=engine)
    with sessionLocal() as db:
        seed_data(db)
        print("Seeding Complete.")

if __name__ == "__main__":
    force_seed()
