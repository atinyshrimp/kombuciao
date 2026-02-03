# Kombuciao Data Management Scripts

[![Python](https://img.shields.io/badge/Python-3.7+-blue.svg?style=for-the-badge&logo=python)](https://www.python.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green.svg?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)

Python scripts for importing and managing store data from the French government's BANCO database into MongoDB.

> **Note**: The Express.js API backend has been consolidated into the Next.js frontend application (see `frontend/lib/server/`). This directory now only contains data management utilities.

## Overview

This directory provides Python scripts for:

- **Importing store data** from BANCO (Base Nationale des Commerces Ouverte)
- **Updating store types** for existing records
- **Automated deduplication** by OSM ID
- **Timestamp-based updates** to avoid unnecessary re-imports

## Prerequisites

- Python 3.7+
- MongoDB Atlas account or local MongoDB instance

## Installation

### 1. Python Environment Setup

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt
```

### 2. Environment Configuration

Create a `.env` file in the backend directory:

```env
MONGODB_URI="your_mongodb_connection_string"
```

## Project Structure

```
backend/
├── scripts/
│   ├── banco_to_mongo.py   # Import BANCO data
│   └── update_types.py     # Update store types
├── .env                    # Environment variables
├── .gitignore             # Git ignore rules
├── requirements.txt       # Python dependencies
└── README.md              # This file
```

## Scripts

### `banco_to_mongo.py` - Import Store Data

Imports store data from the French government's BANCO database.

**Features:**

- Downloads latest CSV data from data.gouv.fr
- Filters for relevant store types (supermarkets, convenience, grocery, organic)
- Upserts into MongoDB with deduplication by `osmId`
- Checks timestamps to avoid unnecessary re-imports

**Usage:**

```bash
python scripts/banco_to_mongo.py
```

### `update_types.py` - Update Store Types

Updates the `types` field for existing stores without creating new ones.

**Usage:**

```bash
python scripts/update_types.py
```

## Running the Scripts

```bash
# Activate virtual environment
venv\Scripts\activate  # Windows
# or
source venv/bin/activate  # macOS/Linux

# Run import script
python scripts/banco_to_mongo.py

# Or update types
python scripts/update_types.py
```

## Python Dependencies

The `requirements.txt` includes:

- **pandas** - Data manipulation and CSV processing
- **requests** - HTTP client for downloading data
- **pymongo** - MongoDB driver
- **tqdm** - Progress bars
- **python-dotenv** - Environment variable management

## When to Run Scripts

### `banco_to_mongo.py`

Run when you need to:

- Import initial store data
- Update store information from BANCO
- Add new stores that appeared in BANCO

The script automatically checks timestamps to avoid re-importing unchanged data.

### `update_types.py`

Run when:

- Store type classifications change in BANCO
- You need to refresh the `types` field for existing stores

## Data Source

Store data comes from [BANCO (Base Nationale des Commerces Ouverte)](https://www.data.gouv.fr/datasets/base-nationale-des-commerces-ouverte/), a French public database of commercial establishments.

**Filtered store types:**

- Supermarket
- Convenience store
- Grocery store
- Organic shop

## MongoDB Collections

The scripts populate the `stores` collection with this schema:

```javascript
{
  name: String,
  address: {
    street: String,
    postcode: String,
    city: String
  },
  location: {
    type: "Point",                     // GeoJSON Point
    coordinates: [longitude, latitude] // [lng, lat]
  },
  openingHours: String,
  types: [String],                     // e.g., ["supermarket", "organic"]
  osmId: String,                       // Unique OSM identifier
  createdAt: Date,
  updatedAt: Date
}
```

## Troubleshooting

**Connection errors:**

- Verify `MONGODB_URI` in `.env`
- Check MongoDB Atlas network access settings
- Ensure your IP is whitelisted

**Import fails:**

- Check internet connection (script downloads from data.gouv.fr)
- Verify Python dependencies are installed
- Check MongoDB disk space

**No stores imported:**

- Verify the ALLOWED_TYPES filter matches your needs
- Check the CSV structure hasn't changed

## Automation

Consider scheduling these scripts to run periodically:

**Windows Task Scheduler:**

```bash
# Create a batch file: update_stores.bat
cd C:\path\to\kombuciao\backend
venv\Scripts\activate
python scripts\banco_to_mongo.py
```

**Linux/Mac cron:**

```bash
# Add to crontab (run weekly on Sunday at 2 AM)
0 2 * * 0 cd /path/to/kombuciao/backend && source venv/bin/activate && python scripts/banco_to_mongo.py
```

## Migration Note

The Express.js API server that was previously in this directory has been consolidated into the Next.js frontend application. All API functionality is now available at `frontend/app/api/` and `frontend/lib/server/`.

**What was moved:**

- ✅ Models → `frontend/lib/server/models/`
- ✅ Controllers → `frontend/lib/server/controllers/`
- ✅ Middleware → `frontend/lib/server/middleware/`
- ✅ Routes → `frontend/app/api/`
- ✅ DB config → `frontend/lib/server/config/`

**What remains here:**

- Python data import scripts (these are independent utilities)

## Contributing

These data import scripts are maintained alongside the main Kombuciao application. Feel free to:

- Report issues with data imports
- Suggest improvements to filtering logic
- Contribute new data sources
- Optimize import performance

See the main [README](../README.md) for contributing guidelines.

## License

This project is distributed under the **Polyform Noncommercial 1.0.0** license. See [LICENSE](../LICENSE) for details.

## Related Documentation

- [Main Project README](../README.md)
- [Frontend Documentation](../frontend/README.md)
- [BANCO Data Source](https://www.data.gouv.fr/datasets/base-nationale-des-commerces-ouverte/)

## Features

- ✅ Store CRUD operations
- ✅ Geospatial queries with MongoDB
- ✅ Community reporting system
- ✅ Data import from BANCO database
- ✅ Error handling and validation
- ✅ CORS support for frontend integration
- ✅ Authorization

Future enhancements could include:

- Rate limiting
- Caching layer
- Additional store metadata fields
- Store categories and filtering
- Report moderation tools
