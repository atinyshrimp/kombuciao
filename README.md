# Kombuciao 🍃

[![License: Polyform Noncommercial](https://img.shields.io/badge/License-Polyform%20Noncommercial%201.0.0-blue.svg?style=for-the-badge)](https://polyformproject.org/licenses/noncommercial/1.0.0/)\
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black.svg?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue.svg?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green.svg?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-38B2AC.svg?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

A _source-available_ platform to locate stores selling Ciao Kombucha near you.

## 🍃 About

Kombuciao is a complete web application that helps you quickly find where to buy Ciao Kombucha. The application uses geolocation to show you nearby stores with available flavors, powered by an active community of Squeezos.

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

The project is divided into two main parts:

### Frontend (`/frontend`)

- **Next.js 15** with React 19 and TypeScript
- **Tailwind CSS** for styling
- **Leaflet** for interactive maps
- **shadcn/ui** for components
- **Mobile-first responsive design**

### Backend (`/backend`)

- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **Python scripts** for data import
- **RESTful API** with CORS
- **Geolocation** and spatial queries

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

### Complete Installation

1. **Clone the repository:**

```bash
git clone https://github.com/atinyshrimp/kombuciao.git
cd kombuciao
```

2. **Create an .env file**

```env
MONGODB_URI="your_mongodb_connection_string"
PORT=8080
NODE_ENV="development"
```

3. **Set up the backend:**

```bash
cd backend
npm install

# Set up Python environment for data import
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
```

3. **Set up the frontend:**

```bash
cd ../frontend
npm install
```

4. **Import store data:**

```bash
cd ../backend
source venv/bin/activate  # or venv\Scripts\activate on Windows
python scripts/banco_to_mongo.py
```

5. **Start the servers:**

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

6. **Open your browser:**
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend API: [http://localhost:8080](http://localhost:8080)

## 🛠️ Technologies Used

### Frontend

- **Framework**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Maps**: Leaflet, react-leaflet
- **UI Components**: shadcn/ui, Radix UI
- **Icons**: Lucide React
- **Notifications**: Sonner
- **State Management**: React Context

### Backend

- **Runtime**: Node.js
- **Framework**: Express.js 5.1.0
- **Database**: MongoDB with Mongoose 8.16.1
- **CORS**: 2.8.5
- **Environment**: dotenv 17.0.0
- **Development**: nodemon 3.1.10

### Data Import

- **Language**: Python 3.7+
- **Data Processing**: pandas
- **MongoDB**: pymongo

## 📁 Project Structure

```
kombuciao/
├── frontend/                 # Next.js application
│   ├── app/                 # Pages and layouts
│   ├── components/          # React components
│   │   ├── cards/          # Store cards
│   │   ├── features/       # Features
│   │   ├── map/            # Map components
│   │   └── ui/             # UI components
│   ├── lib/                # Utilities and API
│   ├── types/              # TypeScript types
│   └── public/             # Static assets
├── backend/                 # Node.js API
│   ├── config/             # Configuration
│   ├── controllers/        # Business logic
│   ├── models/             # MongoDB schemas
│   ├── routes/             # API routes
│   ├── scripts/            # Python scripts
│   └── server.js           # Entry point
└── README.md               # This file
```

## 🔌 API Endpoints

### Stores (`/stores`)

- `GET /stores` - List stores with geospatial filters
- `POST /stores` - Create a store
- `GET /stores/:id` - Get store details
- `PUT /stores/:id` - Update a store
- `DELETE /stores/:id` - Delete a store

### Reports (`/reports`)

- `GET /reports` - List availability reports
- `POST /reports` - Create a report
- `POST /reports/:id/confirm` - Confirm a report
- `POST /reports/:id/deny` - Deny a report
- `DELETE /reports/:id` - Delete a report

### Available Filters

- `lat`, `lng`: Geographic coordinates
- `radius`: Search radius (in meters)
- `flavor`: Filter by flavor (multiple)
- `onlyAvailable`: Only stores with recent availability
- `page`, `pageSize`: Pagination

## 🔒 API Security

All API calls from the frontend to the backend are now securely proxied through Next.js API routes. These API routes inject the API key server-side, ensuring that secrets are never exposed to the browser. This setup guarantees secure communication between the frontend and backend, and prevents unauthorized access to protected endpoints.

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

### Environment Variables

#### Backend (.env)

```env
MONGODB_URI="your_mongodb_connection_string"
PORT=8080
NODE_ENV="production"
```

#### Frontend

The frontend uses Next.js environment variables for API configuration.

### Production

```bash
# Backend
cd backend
npm start

# Frontend
cd frontend
npm run build
npm start
```

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
