import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    APP_NAME = "Real Estate AI"
    ENV = os.getenv("ENV")
    MONGO_URI = os.getenv("MONGO_URI")
    DB_NAME = os.getenv("DB_NAME")
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
    GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-1.0-pro")

settings = Settings()