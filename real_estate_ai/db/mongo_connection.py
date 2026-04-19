# from pymongo import MongoClient

# client = MongoClient("mongodb://localhost:27017")

# db = client["real_estate_db"]
# properties_collection = db["properties"]

# def insert_property(data):
#     properties_collection.insert_one(data)

from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017/")
db = client["real_estate_db"]

#  CLEAN collection (used by AI later)
properties_collection = db["properties"]

# RAW collection (scraper writes here first)
raw_properties_collection = db["raw_properties"]


def insert_property(data):
    properties_collection.insert_one(data)


def insert_raw_property(data):
    raw_properties_collection.insert_one(data)