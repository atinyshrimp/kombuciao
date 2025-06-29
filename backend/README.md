# Kombucha Backend

A Node.js backend application for managing store data with MongoDB integration and Python data import scripts.

## Overview

This backend provides:

- Store data management with MongoDB
- Geospatial queries for store locations  
- Python script for importing French commercial data (BANCO database)
- RESTful API endpoints for store operations
- CORS support for frontend integration

## Prerequisites

- Node.js (v14 or higher)
- Python 3.7+
- MongoDB Atlas account or local MongoDB instance

## Installation

### 1. Clone and Setup Node.js Environment

```bash
cd backend
npm install
```

### 2. Environment Configuration

Create a `.env` file in the backend directory with your MongoDB connection string:

```env
MONGODB_URI="your_mongodb_connection_string"
PORT=8080
NODE_ENV=development
```

### 3. Python Environment Setup (for Data Import)

The [`banco_to_mongo.py`](scripts/banco_to_mongo.py) script requires a separate Python environment:

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

## Project Structure

```
backend/
├── config/
│   ├── index.js           # Configuration management
│   └── db.js              # Database connection
├── controllers/
│   └── store.js           # Store business logic (implemented)
├── models/
│   └── store.js           # Store MongoDB schema
├── routes/
│   └── store.js           # Store API routes (implemented)
├── scripts/
│   └── banco_to_mongo.py  # Python data import script
├── utils/                 # Utility functions
├── .env                   # Environment variables
├── .gitignore            # Git ignore rules
├── requirements.txt      # Python dependencies
├── package.json          # Node.js dependencies
└── server.js             # Main application entry point
```

## Usage

### Starting the Application

```bash
npm start
# or for development with auto-reload:
npm run dev
```

The server will start on `http://localhost:8080` (or your configured PORT).

### Importing Store Data

The Python script [`banco_to_mongo.py`](scripts/banco_to_mongo.py) imports French commercial establishment data:

1. **Activate Python virtual environment:**

   ```bash
   # Windows:
   venv\Scripts\activate
   # macOS/Linux:
   source venv/bin/activate
   ```

2. **Set environment variables (same as Node.js app):**

   ```bash
   # The script uses the same MONGODB_URI
   # Database: "test", Collection: "stores" (hardcoded in script)
   ```

3. **Run the import script:**
   ```bash
   python scripts/banco_to_mongo.py
   ```

The script will:

- Download the latest BANCO dataset from data.gouv.fr
- Filter for supermarkets, convenience stores, grocery stores, and organic shops
- Import data into MongoDB with geospatial indexing
- Create unique indexes to prevent duplicates (name + coordinates)

## Database Schema

The [`Store`](models/store.js) model includes:

```javascript
{
  name: String (required),
  address: {
    street: String,
    postcode: String,
    city: String
  },
  location: {
    type: "Point",                    // GeoJSON Point
    coordinates: [longitude, latitude] // [lng, lat]
  },
  openingHours: String,              // e.g., "Mon-Fri 9-18"
  createdAt: Date,                   // Auto-generated
  updatedAt: Date                    // Auto-generated
}
```

## API Endpoints

All endpoints are fully implemented and available at `/stores`:

- `POST /stores` - Create a new store
- `GET /stores` - List all stores (with optional geospatial filtering)
- `GET /stores/:id` - Get a specific store by ID
- `PUT /stores/:id` - Update a store
- `DELETE /stores/:id` - Delete a store

### Geospatial Queries

The `GET /stores` endpoint supports location-based filtering:

```bash
# Find stores near a location (within 5km by default)
GET /stores?lat=48.8566&lng=2.3522

# Specify custom radius (in meters)
GET /stores?lat=48.8566&lng=2.3522&radius=10000

# Pagination
GET /stores?page=1&pageSize=20
```

### Example API Usage

```bash
# Create a store
curl -X POST http://localhost:8080/stores \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Bio Market",
    "address": {"street": "123 Main St", "city": "Paris", "postcode": "75001"},
    "location": {"type": "Point", "coordinates": [2.3522, 48.8566]},
    "openingHours": "Mon-Sat 9-19"
  }'

# Get nearby stores
curl "http://localhost:8080/stores?lat=48.8566&lng=2.3522&radius=5000"
```

## Development

The application uses:

- **Express.js** 5.1.0 for the web framework
- **Mongoose** 8.16.1 for MongoDB ODM
- **CORS** 2.8.5 for cross-origin requests
- **dotenv** 17.0.0 for environment configuration
- **nodemon** 3.1.10 (dev) for development auto-reload

## Dependencies

### Node.js Dependencies
- `express` - Web framework
- `mongoose` - MongoDB object modeling
- `cors` - Cross-origin resource sharing
- `dotenv` - Environment variable management
- `nodemon` (dev) - Development auto-reload

### Python Dependencies
- `pandas` - Data manipulation and CSV processing
- `pymongo` - MongoDB Python driver
- `tqdm` - Progress bars for data import
- `requests` - HTTP requests for downloading BANCO data

## Environment Variables

Required environment variables:

```env
MONGODB_URI="mongodb://localhost:27017" # or your MongoDB Atlas connection string
PORT=8080                               # Server port (optional, defaults to 8080)
NODE_ENV=development                    # Environment mode (optional)
```

## Error Handling

The API includes comprehensive error handling:
- Input validation for required fields
- Proper HTTP status codes
- Detailed error messages
- Global error handler for uncaught exceptions

## Contributing

The backend is fully functional with implemented:
- ✅ Store CRUD operations
- ✅ Geospatial queries with MongoDB
- ✅ Data import from BANCO database
- ✅ Error handling and validation
- ✅ CORS support for frontend integration

Future enhancements could include:
- Authentication and authorization
- Rate limiting
- Caching layer
- Additional store metadata fields
- Store categories and filtering
