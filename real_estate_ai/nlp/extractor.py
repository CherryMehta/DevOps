import re
from difflib import get_close_matches

# Known vocabulary
INTENT_WORDS = ["buy", "rent", "sell"]
PROPERTY_TYPES = ["flat", "apartment"]
UNIT_WORDS = ["lakh", "lakhs", "k", "thousand"]
KEYWORDS = ["bhk"]

# Known cities & localities (expandable)
CITIES = ["indore"]
LOCALITIES = [
    "vijay nagar",
    "palasia",
    "bhawarkuan",
    "rajendra nagar",
    "rau",
    "super corridor"
]


def fuzzy_match(word, choices, cutoff=0.75):
    match = get_close_matches(word, choices, n=1, cutoff=cutoff)
    return match[0] if match else None


def extract_info(text: str) -> dict:
    text = text.lower()

    words = text.split()

    data = {
        "intent": None,
        "city": None,
        "locality": None,
        "bhk": None,
        "budget": None,
        "property_type": None
    }

    # ------------------------
    # INTENT DETECTION
    # ------------------------
    for word in words:
        intent = fuzzy_match(word, INTENT_WORDS)
        if intent:
            data["intent"] = intent
            break

    # ------------------------
    # PROPERTY TYPE
    # ------------------------
    for word in words:
        ptype = fuzzy_match(word, PROPERTY_TYPES)
        if ptype:
            data["property_type"] = ptype
            break

    # ------------------------
    # BHK DETECTION (robust)
    # ------------------------
    bhk_pattern = re.search(r"(\d+)\s*\w*", text)
    if bhk_pattern:
        number = int(bhk_pattern.group(1))
        for word in words:
            if fuzzy_match(word, ["bhk", "bkh", "bhkk"]):
                data["bhk"] = number
                break


    budget_pattern = re.search(r"(\d+(\.\d+)?)\s*(lakh|lakhs|lkah|lkh)", text)
    if budget_pattern:
        amount = float(budget_pattern.group(1))
        data["budget"] = int(amount * 100000)
    else:
        rent_budget_pattern = re.search(r"(\d+(\.\d+)?)\s*(k|thousand)\b", text)
        if rent_budget_pattern:
            amount = float(rent_budget_pattern.group(1))
            data["budget"] = int(amount * 1000)

    plain_under_pattern = re.search(r"(under|below|upto|up to)\s*(\d+(\.\d+)?)\b", text)
    if plain_under_pattern and data["budget"] is None:
        amount = float(plain_under_pattern.group(2))
        if data["intent"] == "rent" or amount < 100000:
            data["budget"] = int(amount)


    
    for word in words:
        city_match = fuzzy_match(word, CITIES)
        if city_match:
            data["city"] = city_match.title()
            break

    
    for locality in LOCALITIES:
        locality_words = locality.split()

        for i in range(len(words)):
            phrase = " ".join(words[i:i+len(locality_words)])
            match = fuzzy_match(phrase, [locality], cutoff=0.7)
            if match:
                data["locality"] = locality.title()
                break

        if data["locality"]:
            break        

    if data["locality"] and not data["city"]:
        data["city"] = "Indore"

    return data
