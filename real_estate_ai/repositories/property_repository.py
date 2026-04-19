from db.mongo import db
import re

collection = db["properties"]

def get_all_properties():
    return list(collection.find({}, {"_id": 0}))


def _extract_numeric_price(price):
    if price is None:
        return None

    if isinstance(price, (int, float)):
        return int(price)

    if isinstance(price, str):
        cleaned_price = price.replace(",", "").strip()
        lakh_match = re.search(r"(\d+(\.\d+)?)\s*(L|Lakh)", cleaned_price, re.I)
        crore_match = re.search(r"(\d+(\.\d+)?)\s*(Cr|Crore)", cleaned_price, re.I)

        if lakh_match:
            return int(float(lakh_match.group(1)) * 100000)

        if crore_match:
            return int(float(crore_match.group(1)) * 10000000)

    return None


def find_properties(filters: dict, skip: int = 0, limit: int = 12):
    query = {}

    listing_type = filters.get("listing_type")
    if listing_type:
        query["listing_type"] = listing_type

    city = filters.get("city")
    if city:
        query["city"] = {"$regex": f"^{city}$", "$options": "i"}

    locality = filters.get("locality")
    if locality:
        query["locality"] = {"$regex": locality, "$options": "i"}

    bhk = filters.get("bhk")
    if bhk is not None:
        if bhk >= 4:
            query["bhk"] = {"$gte": bhk}
        else:
            query["bhk"] = bhk

    budget = filters.get("budget")
    if budget and listing_type == "rent":
        price_field = "rent_per_month" if listing_type == "rent" else "price"
        query[price_field] = {"$lte": budget}

    cursor = collection.find(query, {"_id": 0})
    results = list(cursor)

    if budget and listing_type == "buy":
        results = [
            property_data
            for property_data in results
            if (_extract_numeric_price(property_data.get("price")) or 0) <= budget
        ]

    return results[skip:skip + limit]