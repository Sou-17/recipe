from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db.session import engine
from app.db.base import Base
from app.models import recipe
from app.api.routes_recipes import router as recipe_router
from app.api.routes_mealplan import router as meal_router


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(recipe_router, prefix="/recipes", tags=["Recipes"])
app.include_router(meal_router, prefix="/mealplan", tags=["Meal Plan"])
Base.metadata.create_all(bind=engine)

@app.get("/")
def root():
    return {"message": "Recipe AI is running 🚀"}