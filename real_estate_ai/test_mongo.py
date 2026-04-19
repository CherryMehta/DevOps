from db.mongo_connection import insert_property

sample = {
    "city": "Indore",
    "locality": "Vijay Nagar",
    "listing_type": "buy",
    "price": 4500000,
    "bhk": 2,
    "area_sqft": 1200
}

insert_property(sample)

print("Data inserted successfully ✅")