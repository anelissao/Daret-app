# Daret API - Digital Tontine Management System

A full-stack Digital "Daret" (savings circle) platform. It features a robust Express/MongoDB backend and a premium, responsive React/Tailwind frontend.

## 🚀 Key Features

### Frontend (Client)
- **Premium UI**: Custom "Indigo/Violet" theme with glassmorphism effects.
- **Secure Auth**: Split-screen Login/Register with JWT integration.
- **Dashboard**: Interactive charts and "Reliability Score" animated gauge.
- **Group Wizard**: Step-by-step group creation process.
- **E-Payment**: Contribution tracking with receipt upload.

### Backend (API)
- **User Management**: KYC verification & Profile management.
- **Reliability Scoring**: Automated algorithm for user trust scores.
- **Notifications**: Automated reminders for payments and turns.
- **N-Tier Architecture**: Scalable, modular design.

## 🛠 Tech Stack

### Frontend
- **Framework**: React (Vite)
- **Styling**: Tailwind CSS v3
- **State**: React Context API
- **HTTP**: Axios (w/ Interceptors)
- **Animations**: Framer Motion

### Backend
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose)
- **Validation**: Joi
- **Testing**: Jest & Supertest
- **Container**: Docker

## 📂 Project Structure

```bash
Daret-app/
├── client/              # React Frontend
│   ├── src/
│   │   ├── components/  # UI & Feature Components
│   │   ├── pages/       # Route Pages (Auth, Dashboard, etc.)
│   │   ├── contexts/    # Global State (Auth)
│   │   └── lib/         # Utilities & API Client
│   └── vite.config.js
│
├── src/                 # Express Backend
│   ├── config/          # DB & Auth Config
│   ├── controllers/     # Request Handlers
│   ├── models/          # Mongoose Schemas
│   ├── roures/          # API Routes
│   └── services/        # Business Logic
└── docker-compose.yml
```

## ⚡ Quick Start

### 1. Start Backend
```bash
# Install dependencies
npm install

# Start development server (Port 3000)
npm run dev
```

### 2. Start Frontend
```bash
cd client

# Install dependencies
npm install

# Start development server (Port 5173)
npm run dev -- --force
```

Visit **http://localhost:5173** to access the application.

## 🧪 Testing

### Backend
```bash
npm test
```

## 📄 License
ISC
