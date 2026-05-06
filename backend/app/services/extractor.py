import json


def extract_json_ld(soup):
    scripts = soup.find_all("script", type="application/ld+json")

    for script in scripts:
        try:
            if not script.string:
                continue

            data = json.loads(script.string)

            # Case 1: list
            if isinstance(data, list):
                for item in data:
                    if isinstance(item, dict) and "Recipe" in str(item.get("@type", "")):
                        return item

            # Case 2: dict
            elif isinstance(data, dict):

                # direct recipe
                if "Recipe" in str(data.get("@type", "")):
                    return data

                # graph
                if "@graph" in data:
                    for item in data["@graph"]:
                        if isinstance(item, dict) and "Recipe" in str(item.get("@type", "")):
                            return item

        except:
            continue

    return None


def normalize_recipe(data, url):
    return {
        "title": data.get("name"),
        "ingredients": data.get("recipeIngredient", []),
        "steps": [
            step.get("text") if isinstance(step, dict) else step
            for step in data.get("recipeInstructions", [])
        ],
        "cook_time": data.get("totalTime"),
        "servings": data.get("recipeYield"),
        "source_url": url
    }