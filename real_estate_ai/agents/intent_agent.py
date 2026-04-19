from nlp.extractor import extract_info

class IntentAgent:
    def process(self, message: str) -> dict:
        return extract_info(message)