#!/usr/bin/env python3
"""
Import filtered BANCO (BAse Nationale des Commerces Ouverte) data into MongoDB.
- Downloads the latest CSV ZIP from data.gouv.fr
- Filters for supermarkets / convenience stores / etc.
- Upserts into Mongo (unique index on osmId)

Dependencies:
    pip install -r requirements.txt

Environment variables required:
    MONGODB_URI  => mongodb://user:pass@host:port/db
    DB_NAME      => prod          (default if not set)
    COLL_NAME    => stores        (default if not set)
"""

import os, io, zipfile, tempfile, requests, sys, math
from datetime import datetime
import pandas as pd
from tqdm import tqdm
from pymongo import MongoClient, UpdateOne
from pymongo.errors import BulkWriteError
from dotenv import load_dotenv

# 1️⃣ CONFIG ------------------------------------------------------------------

ZIP_URL = "https://www.data.gouv.fr/fr/datasets/r/3d612ad7-f726-4fe5-a353-bdf76c5a44c2"  # WGS84 CSV
ALLOWED_TYPES = {"supermarket", "convenience", "grocery", "organic"}

load_dotenv()

MONGO_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
DB_NAME   = "prod"
COLL_NAME = "stores"

BULK_SIZE = 1000  # docs per bulkWrite

DROP_COLS = [
    "wheelchair", "level", "siret", "profession_ref",
    "wikidata", "website", "phone", "email", "facebook", "com_insee"
]

# 2️⃣ CONNECT TO MONGO --------------------------------------------------------

client = MongoClient(f"{MONGO_URI}&tlsAllowInvalidCertificates=true")
coll   = client[DB_NAME][COLL_NAME]


# 3️⃣ DOWNLOAD & EXTRACT ------------------------------------------------------

print("⬇️  Downloading BANCO …")
resp = requests.get(ZIP_URL, timeout=60)
resp.raise_for_status()

isUpdateMode = False
with tempfile.TemporaryDirectory() as tmpdir:
    with zipfile.ZipFile(io.BytesIO(resp.content)) as z:
        csv_name = next((n for n in z.namelist() if n.endswith("data.csv")), None)
        metadata_name = next((n for n in z.namelist() if n.endswith("metadata.csv")), None)
        if not csv_name or not metadata_name:
            print("CSV not found in archive.", file=sys.stderr)
            sys.exit(1)
        z.extract(csv_name, path=tmpdir)
        csv_path = os.path.join(tmpdir, csv_name)
        z.extract(metadata_name, path=tmpdir)
        metadata_path = os.path.join(tmpdir, metadata_name)

    # 4️⃣ CHECK FOR LAST UPDATE ------------------------------------------------

    metadata_df = pd.read_csv(metadata_path, sep=";", low_memory=False)
    last_banco_update_str = metadata_df.loc[0, "DATE_MAJ"]
    if not last_banco_update_str:
        print("No last_update found in metadata.", file=sys.stderr)
        sys.exit(1)
    print(f"🕒 Last BANCO update: {last_banco_update_str}")

    latest_doc = coll.find_one(sort=[("updatedAt", -1)], projection={"updatedAt": 1})
    if latest_doc:
        last_banco_update = datetime.strptime(last_banco_update_str, "%Y-%m-%d")
        last_mongo_update = latest_doc["updatedAt"]
        if last_banco_update >= last_mongo_update:
            print("MongoDB data is not up to date, proceeding with update.")
            isUpdateMode = True
        else:
            print("MongoDB data is up to date, skipping update.")
            sys.exit(0)
    else:
        print("No documents in collection, skipping update, proceeding with full import.")


    # 4️⃣ LOAD & FILTER -------------------------------------------------------
    df = pd.read_csv(csv_path, sep=";", low_memory=False)
    print(f"📄 CSV rows total: {len(df):,}")

    # drop unneeded columns
    df = df.drop(columns=[c for c in DROP_COLS if c in df.columns], errors="ignore")

    # keep only allowed types (handles multi-tag strings)
    mask = df["type"].apply(
        lambda x: any(tag in ALLOWED_TYPES for tag in str(x).lower().split(";"))
    )
    stores_df = df[mask].copy()
    print(f"✅ Rows kept after type filter: {len(stores_df):,}")

    if isUpdateMode:
        # get all documents to update
        date_mask = stores_df["last_update"].apply(
            lambda x: datetime.strptime(x, "%Y-%m-%d") >= last_mongo_update
        )
        stores_df = stores_df[date_mask]
        print(f"✅ Rows kept after update filter: {len(stores_df):,}")

# 6️⃣ BUILD BULK UPSERTS ------------------------------------------------------

def row_to_update(row):
    try:
        lon, lat = float(row["X"]), float(row["Y"])
    except (ValueError, TypeError):
        return None
    if math.isnan(lon) or math.isnan(lat):
        return None
    
    osm_id = row.get("osm_id", None)
    if not osm_id or osm_id == "" or pd.isna(osm_id):
        return None

    update_filter = {"osmId": osm_id}
    existing = coll.find_one(update_filter)

    # Skip if the document is already up to date
    if existing and datetime.strptime(row["last_update"], "%Y-%m-%d") < existing["updatedAt"]:
        return None

    name = row.get("name", "Sans nom") or row.get("brand", "Sans nom")
    if name is None or name == "" or pd.isna(name) or not name.strip():
        name = "Sans nom"

    street = row.get("address", "")
    if street is None or street == "" or pd.isna(street) or not street.strip():
        street = ""

    address = {
        "street": street,
        "city": row.get("com_nom", ""),
    }   

    types = [type.strip() for type in row.get("type", "").lower().split(";")]
    opening_hours = row.get("opening_hours", "")
    if opening_hours is None or pd.isna(opening_hours) or not opening_hours.strip():
        opening_hours = ""

    now = datetime.now()

    doc = {
        "name": name,
        "address": address,
        "location": {
            "type": "Point",
            "coordinates": [lon, lat]
        },
        "osmId": osm_id,
        "openingHours": opening_hours,
        "types": types,
        "updatedAt": now,
    }
    
    # Set createdAt only for new documents
    if not existing:
        doc["createdAt"] = now

    return UpdateOne(
        update_filter,
        {"$set": doc},
        upsert=True
    )

ops, processed = [], 0
print("⬆️  Importing into Mongo…")
for _, row in tqdm(stores_df.iterrows(), total=len(stores_df)):
    op = row_to_update(row)
    if op:
        ops.append(op)
    if len(ops) >= BULK_SIZE:
        try:
            res = coll.bulk_write(ops, ordered=False)
        except BulkWriteError as bwe:
            print("Bulk error:", bwe.details)
        ops.clear()
        processed += BULK_SIZE

# flush remaining
if ops:
    coll.bulk_write(ops, ordered=False)
    processed += len(ops)

print(f"🏁 Done. Upserted ~{processed:,} store documents.")
client.close()
