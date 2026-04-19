# from pymongo import MongoClient
# from config.settings import settings

# client = MongoClient(settings.MONGO_URI)
# db = client[settings.DB_NAME]

# print("Connected to database:", db.name)

import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

client = MongoClient(os.getenv("MONGO_URI"))
db = client[os.getenv("DB_NAME")]# pyright: ignore[reportArgumentType]
collection = db[os.getenv("COLLECTION_NAME")] # pyright: ignore[reportArgumentType]
print("Connected to database:", db.name)

print("DB NAME:", os.getenv("DB_NAME"))