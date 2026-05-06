from pydantic import BaseModel

class RecipeRequest(BaseModel):
    url: str