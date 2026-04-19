from repositories.property_repository import get_all_properties
from repositories.lead_repository import save_lead
import re


class ActionAgent:

    # ---------------------------
    # 🧠 PRICE CONVERTER
    # ---------------------------
    def extract_numeric_price(self, price):
        """
        Converts:
        ₹40 Lakh → 4000000
        ₹1.2 Cr → 12000000
        4500000 → 4500000
        None → None
        """

        if price is None:
            return None

        if isinstance(price, (int, float)):
            return int(price)

        if isinstance(price, str):
            price = price.replace(",", "").strip()

            lakh_match = re.search(r"(\d+(\.\d+)?)\s*(L|Lakh)", price, re.I)
            cr_match = re.search(r"(\d+(\.\d+)?)\s*(Cr|Crore)", price, re.I)

            if lakh_match:
                return int(float(lakh_match.group(1)) * 100000)

            if cr_match:
                return int(float(cr_match.group(1)) * 10000000)

        return None

    # ---------------------------
    # 🧠 SCORING FUNCTION
    # ---------------------------
    def score_property(self, property_data: dict, user_data: dict) -> int:
        score = 0

        # Locality match
        if user_data.get("locality") and property_data.get("locality"):
            property_locality = str(property_data["locality"]).strip().lower()
            user_locality = str(user_data["locality"]).strip().lower()
            if property_locality == user_locality:
                score += 10
            elif user_locality in property_locality or property_locality in user_locality:
                score += 7

        # BHK match
        if user_data.get("bhk") and property_data.get("bhk"):
            if property_data["bhk"] == user_data["bhk"]:
                score += 8

        # Property type match
        if user_data.get("property_type") and property_data.get("property_type"):
            if property_data["property_type"] == user_data["property_type"]:
                score += 4

        # 💰 Budget scoring (SAFE)
        intent = user_data.get("intent")
        budget = user_data.get("budget")
        if intent == "rent":
            price = property_data.get("rent_per_month")
        else:
            price = self.extract_numeric_price(property_data.get("price"))

        if budget and price is not None:
            if price <= budget:
                score += 5

                # closer price → higher score
                difference = budget - price
                divisor = 2000 if intent == "rent" else 1000000
                closeness_score = max(0, 5 - (difference // divisor))
                score += closeness_score

        return score

    # ---------------------------
    # 🚀 MAIN EXECUTION
    # ---------------------------
    def execute(self, user_data: dict):

        intent = user_data.get("intent")

        # SELL CASE
        if intent == "sell":
            save_lead({
                "type": "sell",
                "property_details": user_data
            })
            return []

        properties = get_all_properties()

        # 🏙 CITY FILTER (MANDATORY)
        if user_data.get("city"):
            properties = [
                p for p in properties
                if str(p.get("city", "")).strip().lower() == str(user_data.get("city", "")).strip().lower()
            ]

        scored_properties = []

        for prop in properties:
            score = self.score_property(prop, user_data)

            if score > 0:
                scored_properties.append((prop, score))

        # 🔥 SORT BY SCORE
        scored_properties.sort(key=lambda x: x[1], reverse=True)

        # 🎯 TOP 3 RESULTS
        ranked_properties = [item[0] for item in scored_properties[:3]]

        # 💾 SAVE LEAD
        save_lead({
            "type": intent,
            "filters": user_data,
            "matched_strategy": "smart_ranked",
            "matched_count": len(ranked_properties)
        })

        return ranked_properties
