from db.mongo import db
from datetime import datetime

collection = db["leads"]

def save_lead(data: dict):
    data["created_at"] = datetime.utcnow()
    data["status"] = "NEW"
    collection.insert_one(data)