from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.schemas.recipe import RecipeRequest
from app.services.scraper import fetch_page
from app.services.extractor import extract_json_ld, normalize_recipe
from app.services.recipe_service import list_recipes, save_recipe
from app.services.llm import enrich_recipe_with_llm
from app.db.session import get_db

router = APIRouter()

@router.get("/")
def get_recipes(db: Session = Depends(get_db)):
    return {"recipes": list_recipes(db)}


@router.post("/extract")
def extract_recipe(request: RecipeRequest, db: Session = Depends(get_db)):
    soup = fetch_page(request.url)

    # 1. Try to get JSON-LD as a hint
    json_ld = extract_json_ld(soup)
    hint_data = normalize_recipe(json_ld, request.url) if json_ld else {"source_url": request.url}

    # 2. Get clean text from page to help LLM
    for script_or_style in soup(["script", "style"]):
        script_or_style.decompose()
    
    page_text = soup.get_text(separator=" ", strip=True)
    # Limit text to avoid token limits (e.g. first 8000 chars)
    truncated_text = page_text[:8000]

    # 3. Use LLM to extract/refine everything
    enriched_data = enrich_recipe_with_llm(hint_data, truncated_text)

    # Ensure source_url is preserved
    enriched_data["source_url"] = request.url

    saved = save_recipe(db, enriched_data)

    return {
        "message": "Recipe saved",
        "recipe_id": saved.id,
        "title": saved.title
    }


@router.delete("/{recipe_id}")
def delete_recipe(recipe_id: int, db: Session = Depends(get_db)):
    from app.models.recipe import Recipe
    recipe = db.query(Recipe).filter(Recipe.id == recipe_id).first()
    if recipe:
        db.delete(recipe)
        db.commit()
        return {"message": "Recipe deleted"}
    return {"error": "Recipe not found"}, 404
