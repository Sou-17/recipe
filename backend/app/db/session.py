import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost/recipe_ai")

engine = create_engine(DATABASE_URL)
    
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


# 👇 dependency (IMPORTANT: no self-import)
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()