from llm.gemini_client import generate_response

class ResponseAgent:
    def _fallback_response(self, intent: str, data: dict, properties: list) -> str:
        if intent == "sell":
            return "Thanks. I have noted your selling request and someone can follow up with you shortly."

        if not properties:
            return "Sorry, no matching properties were found."

        intro = f"I found {len(properties)} matching {intent} option"
        intro += "s" if len(properties) != 1 else ""

        if data.get("locality"):
            intro += f" near {data['locality']}"
        if data.get("budget"):
            intro += f" within your budget of INR {data['budget']:,}"
        intro += "."

        lines = [intro]
        for index, property_data in enumerate(properties[:3], start=1):
            price = property_data.get("price")
            if intent == "rent":
                rent = property_data.get("rent_per_month")
                price = f"INR {rent:,}/month" if isinstance(rent, (int, float)) else "Price on request"

            lines.append(
                f"{index}. {property_data.get('project_name', 'Property')} in "
                f"{property_data.get('locality', 'Unknown locality')}, "
                f"{property_data.get('city', 'Unknown city')} for {price}"
            )

        return "\n".join(lines)

    def generate(self, intent: str, data: dict, properties: list) -> str:

        if intent == "sell":
            prompt = f"""
            A user wants to sell a property.
            Details: {data}
            Respond politely and confirm follow-up.
            """
            try:
                return generate_response(prompt)
            except Exception:
                return self._fallback_response(intent, data, properties)

        if not properties:
            return "Sorry, no matching properties were found."

        prompt = f"""
        User intent: {intent}
        User requirements: {data}
        Matching properties: {properties}

        Respond like a professional real estate consultant.
        """
        try:
            return generate_response(prompt)
        except Exception:
            return self._fallback_response(intent, data, properties)
