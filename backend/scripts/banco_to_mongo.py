#!/usr/bin/env python3
# banco_to_mongo.py
"""
Import filtered BANCO (Base Nationale des Commerces Ouverte) data into MongoDB.
- Downloads the latest CSV ZIP from data.gouv.fr
- Filters for supermarkets / convenience stores / etc.
- Upserts into Mongo (unique index on name + coordinates)

Dependencies:
    pip install pandas requests pymongo tqdm

Environment variables required:
    MONGODB_URI  => mongodb://user:pass@host:port/db
    DB_NAME      => test          (default if not set)
    COLL_NAME    => stores        (default if not set)
"""

import os, io, zipfile, tempfile, requests, sys, math
from datetime import datetime
import pandas as pd
from tqdm import tqdm
from pymongo import MongoClient, UpdateOne, ASCENDING
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

# 2️⃣ DOWNLOAD & EXTRACT ------------------------------------------------------

print("⬇️  Downloading BANCO …")
resp = requests.get(ZIP_URL, timeout=60)
resp.raise_for_status()

with tempfile.TemporaryDirectory() as tmpdir:
    with zipfile.ZipFile(io.BytesIO(resp.content)) as z:
        csv_name = next((n for n in z.namelist() if n.endswith(".csv")), None)
        if not csv_name:
            print("CSV not found in archive.", file=sys.stderr)
            sys.exit(1)
        z.extract(csv_name, path=tmpdir)
        csv_path = os.path.join(tmpdir, csv_name)

    # 3️⃣ LOAD & FILTER -------------------------------------------------------
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

# 4️⃣ CONNECT TO MONGO --------------------------------------------------------

client = MongoClient(f"{MONGO_URI}&tlsAllowInvalidCertificates=true")
coll   = client[DB_NAME][COLL_NAME]

# 5️⃣ BUILD BULK UPSERTS ------------------------------------------------------

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

    name = row.get("name", "Unnamed") or row.get("brand", "Unnamed")
    if name is None or name == "" or pd.isna(name) or not name.strip():
        name = "Unnamed"
    address = {
        "street": row.get("address", ""),
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
