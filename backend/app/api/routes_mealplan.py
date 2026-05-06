from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
import json
import re

from app.db.session import get_db
from app.models.recipe import Recipe
from app.services.llm import generate_meal_plan

router = APIRouter()


@router.get("/generate")
def generate_plan(db: Session = Depends(get_db)):
    recipes = db.query(Recipe).all()

    if not recipes:
        return {"error": "No recipes saved"}

    formatted = []
    for r in recipes:
        formatted.append({
            "title": r.title,
            "ingredients": json.loads(r.ingredients)
        })

    # 🔹 Call LLM or simple generator
    plan = generate_meal_plan(formatted)

    # Check if it's an error response
    if isinstance(plan, dict) and "error" in plan:
        return plan

    # If plan is already a dict (from simple generator), return it
    if isinstance(plan, dict):
        return {"meal_plan": plan}

    # 🔹 If it's a string from LLM, parse it
    # 🔹 Step 1: remove ```json ``` wrappers
    cleaned = re.sub(r"```json|```", "", plan).strip()

    # 🔹 Step 2: extract JSON portion
    start = cleaned.find("{")
    end = cleaned.rfind("}") + 1

    if start == -1 or end == 0:
        return {"meal_plan": {"raw": plan}}

    json_str = cleaned[start:end]

    # 🔹 Step 3: parse safely
    try:
        parsed = json.loads(json_str)
    except Exception as e:
        print("JSON parse error:", e)
        parsed = {"raw": plan}

    return {
        "meal_plan": parsed
    }