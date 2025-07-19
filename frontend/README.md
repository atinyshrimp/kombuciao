# Kombuciao Frontend

[![Next.js](https://img.shields.io/badge/Next.js-15-black.svg?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue.svg?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-38B2AC.svg?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

A _source-available_ platform to locate stores selling Ciao Kombucha near you.

## 🍃 About

Kombuciao is a web application that helps you quickly find where to buy Ciao Kombucha. The application uses geolocation to show you nearby stores with available flavors.

## ✨ Features

- 🗺️ **Interactive map** with geolocation
- 🔍 **Address or city search**
- 🏪 **Filtering by available flavors**
- 📱 **Responsive interface** for mobile and desktop
- ⚡ **Real-time data** on availability
- 👥 **Community reporting system**
- 🗳️ **Voting on reports** to maintain reliability

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
- npm, yarn, pnpm or bun

### Installation

1. **Clone the repository:**

```bash
git clone https://github.com/atinyshrimp/kombuciao.git
cd kombuciao/frontend
```

2. **Install dependencies:**

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Start the development server:**

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. **Open [http://localhost:3000](http://localhost:3000) in your browser.**

## 🛠️ Technologies Used

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Maps**: Leaflet
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Notifications**: Sonner

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

For commercial use, please contact us.

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

## 📞 Contact

- **GitHub**: [Issues](https://github.com/atinyshrimp/kombuciao/issues)
- **Website**: [kombuciao.com](https://kombuciao.com)

---

Made with ❤️ for the Squeezos
