import os
import json
import random
import re
import requests
from google import genai
from dotenv import load_dotenv

load_dotenv()

# API KEYS (Loaded from .env)
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")


# Clients
gemini_client = genai.Client(api_key=GEMINI_API_KEY)

def call_groq(prompt, system_instruction=""):
    """Fallback to Groq if Gemini fails"""
    try:
        response = requests.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {GROQ_API_KEY}",
                "Content-Type": "application/json"
            },
            json={
                "model": "llama-3.3-70b-versatile",
                "messages": [
                    {"role": "system", "content": system_instruction},
                    {"role": "user", "content": prompt}
                ],
                "temperature": 0.1,
                "response_format": {"type": "json_object"}
            }
        )
        if response.status_code == 200:
            return response.json()["choices"][0]["message"]["content"]
    except Exception as e:
        print(f"Groq Error: {e}")
    return None

def call_gemini(prompt, system_instruction=""):
    """Primary: Gemini 1.5/2.0"""
    try:
        # Try gemini-1.5-flash-latest first as it's the most stable
        response = gemini_client.models.generate_content(
            model="gemini-1.5-flash-latest",
            contents=prompt,
            config={
                'system_instruction': system_instruction,
                'temperature': 0.1,
                'response_mime_type': 'application/json',
            }
        )
        return response.text
    except Exception as e:
        print(f"DEBUG: Gemini Error: {type(e).__name__}: {e}")
        # Automatically fallback to Groq
        return call_groq(prompt, system_instruction)


def generate_meal_plan(recipes):
    if not recipes: return {"error": "No recipes available"}
    titles = [r["title"] for r in recipes]
    prompt = f"""
Create a professional, realistic 7-day meal plan using ONLY these recipes:
{json.dumps(titles)}

### REQUIREMENTS:
1. **DIVERSITY**: Do NOT repeat the same recipe within the same day. 
2. **VARIETY**: Try to distribute all recipes across the week.
3. **STRUCTURE**: Each day must have 'breakfast', 'lunch', and 'dinner'.
4. **FORMAT**: Return ONLY valid JSON.
"""
    
    system_msg = """
You are an expert personal chef. Generate a 7-day meal plan.
CRITICAL: The JSON top-level keys MUST be 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'.
Each value MUST be an object with keys 'breakfast', 'lunch', and 'dinner'.

Example Output:
{
  "monday": {"breakfast": "Recipe A", "lunch": "Recipe B", "dinner": "Recipe C"},
  "tuesday": {"breakfast": "Recipe D", "lunch": "Recipe E", "dinner": "Recipe F"},
  ...
}
"""

    
    content = call_gemini(prompt, system_msg)
    if not content: return {"meal_plan": generate_meal_plan_simple(recipes)}
    try: 
        data = json.loads(content)
        # If the LLM wrapped it in a top-level key like "meal_plan" or "weekly_plan"
        if len(data.keys()) == 1 and isinstance(list(data.values())[0], dict):
            # Check if the inner keys look like days
            inner_keys = list(data.values())[0].keys()
            if any(day in [k.lower() for k in inner_keys] for day in ['monday', 'tuesday']):
                data = list(data.values())[0]
        
        return data
    except: 
        return generate_meal_plan_simple(recipes)




def generate_meal_plan_simple(recipes):
    days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
    return {day: {"breakfast": random.choice(recipes)["title"], "lunch": random.choice(recipes)["title"], "dinner": random.choice(recipes)["title"]} for day in days}

def enrich_recipe_with_llm(hint_data, page_text=""):
    prompt = f"Extract recipe into JSON structure.\nSource: {json.dumps(hint_data)}\nPage Text: {page_text[:20000]}"
    system_msg = """
Return ONLY valid JSON:
{
  "title": "string", "cuisine": "string", "prep_time": "string", "cook_time": "string", "total_time": "string", "servings": number, "difficulty": "easy/med/hard",
  "ingredients": [{"quantity": "string", "unit": "string", "item": "string"}], "instructions": ["string"],
  "nutrition_estimate": {"calories": number, "protein": "string", "carbs": "string", "fat": "string"},
  "substitutions": ["string"], "shopping_list": {"Category": ["Item"]}, "related_recipes": ["string"]
}
MANDATORY: Convert ISO times (PT25M -> 25 mins) and categorize all ingredients.
"""
    content = call_gemini(prompt, system_msg)
    if not content: return hint_data
    try: return json.loads(content)
    except:
        match = re.search(r'\{.*\}', content, re.DOTALL)
        if match:
            try: return json.loads(match.group(0))
            except: pass
    return hint_data
