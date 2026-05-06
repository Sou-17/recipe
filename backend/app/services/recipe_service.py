import json
from app.models.recipe import Recipe

def save_recipe(db, recipe_data):
    # check duplicate
    existing = db.query(Recipe).filter(Recipe.source_url == recipe_data["source_url"]).first()
    if existing:
        return existing

    new_recipe = Recipe(
        title=recipe_data.get("title", "Unknown Recipe"),
        ingredients=json.dumps(recipe_data.get("ingredients", [])),
        steps=json.dumps(recipe_data.get("instructions") or recipe_data.get("steps") or []),

        cook_time=recipe_data.get("cook_time"),
        prep_time=recipe_data.get("prep_time"),
        total_time=recipe_data.get("total_time"),
        servings=recipe_data.get("servings"),
        cuisine=recipe_data.get("cuisine"),
        difficulty=recipe_data.get("difficulty"),
        nutrition=json.dumps(recipe_data.get("nutrition_estimate") or recipe_data.get("nutrition")),
        substitutions=json.dumps(recipe_data.get("substitutions")),
        shopping_list=json.dumps(recipe_data.get("shopping_list")),
        related_recipes=json.dumps(recipe_data.get("related_recipes")),
        source_url=recipe_data["source_url"]
    )


    db.add(new_recipe)
    db.commit()
    db.refresh(new_recipe)

    return new_recipe


def list_recipes(db):
    recipes = db.query(Recipe).all()
    return [
        {
            "id": recipe.id,
            "title": recipe.title,
            "ingredients": json.loads(recipe.ingredients) if recipe.ingredients else [],
            "steps": json.loads(recipe.steps) if recipe.steps else [],
            "cook_time": recipe.cook_time,
            "prep_time": recipe.prep_time,
            "total_time": recipe.total_time,
            "servings": recipe.servings,
            "cuisine": recipe.cuisine,
            "difficulty": recipe.difficulty,
            "nutrition": json.loads(recipe.nutrition) if recipe.nutrition else {},
            "substitutions": json.loads(recipe.substitutions) if recipe.substitutions else [],
            "shopping_list": json.loads(recipe.shopping_list) if recipe.shopping_list else {},
            "related_recipes": json.loads(recipe.related_recipes) if recipe.related_recipes else [],
            "source_url": recipe.source_url,
        }

        for recipe in recipes
    ]