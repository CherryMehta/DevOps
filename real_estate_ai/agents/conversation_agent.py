from agents.intent_agent import IntentAgent
from agents.action_agent import ActionAgent
from agents.response_agent import ResponseAgent


class ConversationAgent:

    def __init__(self):
        self.intent_agent = IntentAgent()
        self.action_agent = ActionAgent()
        self.response_agent = ResponseAgent()

    def handle(self, message: str) -> dict:

        # 🧠 Extract structured info
        data = self.intent_agent.process(message)

        print("DEBUG NLP OUTPUT:", data)

        intent = data.get("intent")
        budget = data.get("budget")

        # ❓ Clarification if intent missing
        if not intent:

            if budget:
                if budget >= 2000000:
                    data["intent"] = "buy"

                elif budget < 100000:
                    data["intent"] = "rent"

                else:
                    return {
                        "reply": "Are you looking to buy or rent this property?",
                        "properties": []
                    }
            else:
                return {
                    "reply": "Are you looking to buy or rent a property?",
                    "properties": []
                }

        # 🏠 Get ranked properties
        properties = self.action_agent.execute(data)

        # 💬 Generate LLM response ✅ FIXED
        reply = self.response_agent.generate(
            data["intent"],
            data,
            properties
        )

        return {
            "reply": reply,
            "properties": properties
        }