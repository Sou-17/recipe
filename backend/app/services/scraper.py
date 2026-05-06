import requests
from bs4 import BeautifulSoup

def fetch_page(url: str):
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        "Accept-Language": "en-US,en;q=0.9"
    }

    res = requests.get(url, headers=headers)
    res.raise_for_status()

    return BeautifulSoup(res.text, "html.parser")