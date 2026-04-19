from db.mongo_connection import db

raw_collection = db["raw_properties"]
clean_collection = db["properties"]


def is_valid_rent(doc):
    return (
        doc.get("listing_type") == "rent"
        and doc.get("rent_per_month") is not None
        and doc.get("bhk") is not None
        and doc.get("locality") not in [None, "N/A"]
    )


inserted = 0

for doc in raw_collection.find({"listing_type": "rent"}):

    if is_valid_rent(doc):

        duplicate = clean_collection.find_one({
            "project_name": doc["project_name"],
            "locality": doc["locality"],
            "rent_per_month": doc["rent_per_month"]
        })

        if not duplicate:

            clean_collection.insert_one({
                "project_name": doc["project_name"],
                "locality": doc["locality"],
                "city": doc["city"],
                "bhk": doc["bhk"],
                "area_sqft": doc["area_sqft"],
                "rent_per_month": doc["rent_per_month"],
                "listing_type": "rent",
                "source": doc["source"]
            })

            inserted += 1

print("✅ Clean rent records inserted:", inserted)