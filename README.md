# Kombuciao 🍃

[![License: Polyform Noncommercial](https://img.shields.io/badge/License-Polyform%20Noncommercial%201.0.0-blue.svg?style=for-the-badge)](https://polyformproject.org/licenses/noncommercial/1.0.0/)\
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black.svg?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue.svg?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green.svg?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-38B2AC.svg?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

A _source-available_ full-stack platform to locate stores selling Ciao Kombucha near you.

> **February 2026 Update**: The backend has been consolidated into the Next.js frontend application for improved performance, simpler deployment, and better developer experience. The `backend/` folder now only contains Python data management scripts.

## 🍃 About

Kombuciao is a complete full-stack web application that helps you quickly find where to buy Ciao Kombucha. The application uses geolocation to show you nearby stores with available flavors, powered by an active community of Squeezos.

## ✨ Features

- 🗺️ **Interactive map** with geolocation
- 🔍 **Address or city search**
- 🏪 **Filtering by available flavors**
- 📱 **Responsive interface** for mobile and desktop
- ⚡ **Real-time data** on availability
- 👥 **Community reporting system**
- 🗳️ **Voting on reports** to maintain reliability
- 🌍 **Geospatial data** with MongoDB
- 📊 **Automatic import** of BANCO data

## 🏗️ Architecture

Kombuciao is a modern full-stack Next.js application with integrated backend functionality:

### Frontend + Backend (`/frontend`)

- **Next.js 15** with App Router - Full-stack framework
- **React 19** and TypeScript - UI and type safety
- **Next.js API Routes** - RESTful API endpoints
- **MongoDB + Mongoose** - Database and ODM
- **Tailwind CSS** - Modern styling
- **Leaflet** - Interactive maps
- **shadcn/ui** - Beautiful components

### Data Management (`/backend`)

- **Python scripts** for importing BANCO data
- **pymongo** - Direct MongoDB access for bulk operations
- **Github Actions** workflow for automated store data updates

## 📊 Data Sources

### Stores

Store information comes from the [Base Nationale des Commerces Ouverte (BANCO)](https://www.data.gouv.fr/datasets/base-nationale-des-commerces-ouverte/), a French public database. **I cannot modify this data directly.**

### Flavor Availability

Information about flavor availability is based on community reports. Each user can:

- Report flavor availability at a store
- Vote on existing reports
- Contribute to maintaining reliable information

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Python 3.7+
- MongoDB (local or Atlas)
- npm, yarn, pnpm or bun

### Installation

1. **Clone the repository:**

```bash
git clone https://github.com/atinyshrimp/kombuciao.git
cd kombuciao
```

2. **Set up the frontend (includes API):**

```bash
cd frontend
npm install
```

3. **Configure environment variables:**

Create `frontend/.env`:

```env
MONGODB_URI="your_mongodb_connection_string"
API_KEY="your_secure_api_key"
```

4. **Set up Python for data import:**

```bash
cd ../backend
python -m venv venv
venv\Scripts\activate  # Windows
# or: source venv/bin/activate  # macOS/Linux
pip install -r requirements.txt
```

Create `backend/.env`:

```env
MONGODB_URI="your_mongodb_connection_string"
```

5. **Import store data:**

```bash
python scripts/banco_to_mongo.py
```

6. **Start the development server:**

```bash
cd ../frontend
npm run dev
```

7. **Open your browser:**
   - Application: [http://localhost:3000](http://localhost:3000)
   - API endpoints available at `/api/*`

## 🛠️ Technologies Used

### Full-Stack Application (Frontend)

- **Framework**: Next.js 15 with App Router
- **Runtime**: React 19
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **Database**: MongoDB with Mongoose ODM
- **Maps**: Leaflet + React Leaflet
- **UI Components**: shadcn/ui (Radix UI)
- **Icons**: Lucide React
- **Notifications**: Sonner
- **State Management**: React Context

### Data Import Scripts (Backend)

- **Language**: Python 3.7+
- **Data Processing**: pandas
- **Database**: pymongo
- **HTTP**: requests
- **Progress**: tqdm

## 📁 Project Structure

```
kombuciao/
├── frontend/                     # Next.js full-stack application
│   ├── app/
│   │   ├── api/                 # API routes (backend endpoints)
│   │   │   ├── stores/         # Store CRUD operations
│   │   │   └── reports/        # Report & voting system
│   │   ├── page.tsx            # Main page
│   │   └── layout.tsx          # Root layout
│   ├── components/              # React components
│   │   ├── cards/              # Store cards
│   │   ├── features/           # Feature components
│   │   ├── map/                # Map components
│   │   └── ui/                 # UI components (shadcn)
│   ├── lib/
│   │   ├── server/             # Server-side code
│   │   │   ├── config/        # DB connection
│   │   │   ├── models/        # MongoDB schemas
│   │   │   ├── controllers/   # Business logic
│   │   │   └── middleware/    # Auth & validation
│   │   └── utils.ts           # Client utilities
│   └── types/                  # TypeScript types
├── backend/                     # Data management scripts
│   ├── scripts/
│   │   ├── banco_to_mongo.py   # Import BANCO data
│   │   └── update_types.py     # Update store types
│   └── requirements.txt        # Python dependencies
└── README.md                   # This file
```

## 🔌 API Endpoints

All API endpoints are now integrated into Next.js at `/api/*`:

### Stores

- `GET /api/stores` - List stores with geospatial filters\
  Query parameters:
  - `lat`, `lng`: Geographic coordinates for proximity search
  - `radius`: Search radius in meters (default: 5000)
  - `name`: Filter by store name (case-insensitive)
  - `flavor`: Filter by available flavors (can use multiple)
  - `onlyAvailable`: Show only stores with recent reports (boolean)
  - `page`, `pageSize`: Pagination parameters
- `GET /api/stores/stats` - Get store statistics
- `GET /api/stores/:id` - Get store details
- `POST /api/stores` - Create a store (requires API key)
- `PUT /api/stores/:id` - Update a store (requires API key)
- `DELETE /api/stores/:id` - Delete a store (requires API key)

### Reports

- `GET /api/reports` - List availability reports\
  Query parameters:
  - `storeId`:
  - `since`:
  - `page`, `pageSize`: Pagination parameters
- `GET /api/reports/:id` - Get specific report
- `POST /api/reports` - Create a report (requires API key)
- `POST /api/reports/:id/vote` - Vote on report (requires API key)
- `DELETE /api/reports/:id/vote/:voteId` - Delete vote (requires API key)
- `DELETE /api/reports/:id` - Delete a report (requires API key)

## 🔒 API Security

Protected endpoints (`POST`, `DELETE`) require an `x-api-key` header. The API key is stored securely server-side and never exposed to the browser.\
This applies only for **external requests**.

## 🗄️ Database

### MongoDB Collections

#### Stores

```javascript
{
  name: String,
  address: { street, postcode, city },
  location: { type: "Point", coordinates: [lng, lat] },
  openingHours: String,
  types: [String],
  createdAt: Date,
  updatedAt: Date
}
```

#### Reports

```javascript
{
  store: ObjectId,
  flavors: [String],
  description: String,
  votes: [{
    voterId: String,
    type: "confirm" | "deny",
    createdAt: Date
  }],
  createdAt: Date,
  updatedAt: Date
}
```

## 🚀 Deployment

### Vercel (Recommended)

1. **Deploy the frontend directory** (contains everything)
2. **Set environment variables** in Vercel dashboard:
   ```
   MONGODB_URI=your_mongodb_connection_string
   API_KEY=your_secure_api_key
   ```
3. That's it! The API is bundled with the frontend.

### Manual Deployment

```bash
cd frontend
npm run build
npm start
```

The application serves both the frontend and API from a single process.

## 🤝 Contributing

Contributions are welcome! Feel free to:

1. Fork the project
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'feat: add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Community Engagement

Kombuciao's relevance depends on community engagement. You can contribute by:

- Reporting flavor availability at stores
- Voting on existing reports
- Reporting bugs or suggesting improvements
- Contributing to the source code

## 📄 License

This project is distributed under the **Polyform Noncommercial 1.0.0** license.

### Permitted Use (Non-commercial):

- ✅ Personal and educational use
- ✅ Open source development contributions
- ✅ Non-commercial research and development
- ✅ Use by non-profit organizations

### Prohibited Use (Commercial):

- ❌ Use in a commercial context
- ❌ Integration into paid products or services
- ❌ Use by for-profit companies
- ❌ Direct or indirect monetization

See [LICENSE](https://github.com/atinyshrimp/kombuciao?tab=License-1-ov-file) for more information.

## 📞 Contact

- **GitHub**: [Issues](https://github.com/atinyshrimp/kombuciao/issues)

## 🙏 Acknowledgments

- [BANCO](https://www.data.gouv.fr/datasets/base-nationale-des-commerces-ouverte/) for store data
- [Ciao Kombucha](https://ciaokombucha.com/) for inspiration
- The Squeezos community for contributions

---

Made with ❤️ for the Squeezos
