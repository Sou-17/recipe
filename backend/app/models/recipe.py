from sqlalchemy import Column, Integer, Text, TIMESTAMP
from sqlalchemy.sql import func
from app.db.base import Base

class Recipe(Base):
    __tablename__ = "recipes"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(Text)
    ingredients = Column(Text)   # store as JSON string
    steps = Column(Text)         # store as JSON string
    cook_time = Column(Text)
    prep_time = Column(Text)
    total_time = Column(Text)
    servings = Column(Text)

    cuisine = Column(Text)
    difficulty = Column(Text)
    nutrition = Column(Text)      # store as JSON string
    substitutions = Column(Text)  # store as JSON string
    shopping_list = Column(Text)  # store as JSON string
    related_recipes = Column(Text) # store as JSON string

    source_url = Column(Text, unique=True, index=True)  # prevent duplicates
    created_at = Column(TIMESTAMP, server_default=func.now())