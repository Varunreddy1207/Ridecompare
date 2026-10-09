# VOZX RideCompare 🚗⚡

> **One Ride. Every Price.**  
> The next-generation real-time multi-provider ride price aggregator and comparison platform across Uber, Ola, and Rapido.

[![Status](https://img.shields.io/badge/status-active-brightgreen.svg)]()
[![License](https://img.shields.io/badge/license-MIT-blue.svg)]()
[![Platform](https://img.shields.io/badge/platform-Mobile%20%7C%20Tablet%20%7C%20Desktop-orange.svg)]()

---

## 🏛️ System Architecture

```
USER
  ↓
VOZX FRONTEND (Vercel)
  ↓ HTTPS
VOZX BACKEND API (Render)
  ↓
PRISMA ORM
  ↓
SUPABASE POSTGRESQL
```

- **Frontend:** Responsive Single Page Application (HTML5, Tailwind CSS, Vanilla JS, Vite build tooling)
- **Backend API:** Node.js, Express, TypeScript, JWT Authentication, Rate Limiting
- **Database & ORM:** Supabase PostgreSQL with Prisma ORM
- **Providers:** Multi-provider fare adapter engine (Uber, Ola, Rapido)

---

## 🌐 Application URLs

### Development (Local)
- **Frontend:** [http://localhost:5173](http://localhost:5173)
- **Backend API:** [http://localhost:5000](http://localhost:5000)
- **Health Endpoint:** [http://localhost:5000/api/health](http://localhost:5000/api/health)
- **System Status Panel:** [http://localhost:5173/#system-status](http://localhost:5173/#system-status)

### Production (Deployments)
- **Frontend (Vercel):** `https://YOUR-FRONTEND-DOMAIN.vercel.app`
- **Backend (Render):** `https://YOUR-BACKEND-DOMAIN.onrender.com`
- **Health Endpoint:** `https://YOUR-BACKEND-DOMAIN.onrender.com/api/health`
- *(Placeholders to be configured upon hosting setup. See [DEPLOYMENT.md](DEPLOYMENT.md) for full instructions).*

---

## 💻 Local Development Setup

### 1. Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

### 2. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install backend dependencies
npm install

# Generate Prisma client
npm run prisma:generate

# Start backend in development mode (port 5000)
npm run dev
```

### 3. Frontend Setup
```bash
# In the project root directory
npm install

# Start frontend development server with Vite (port 5173)
npm run dev
```

### 4. Build for Production
```bash
# Build Frontend (generates /dist)
npm run build

# Build Backend (runs prisma generate && tsc)
cd backend
npm run build

# Run Production Backend
npm start
```

---

## 🔐 Environment Variables

### Backend (`backend/.env`)
```env
PORT=5000
NODE_ENV=development
DATABASE_URL=postgresql://postgres.xxx:password@aws-0-REGION.pooler.supabase.com:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres.xxx:password@aws-0-REGION.pooler.supabase.com:5432/postgres
JWT_SECRET=your-random-jwt-secret-min-32-chars
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173,http://localhost:5000
```

### Frontend (`.env`)
```env
VITE_API_URL=http://localhost:5000
```

> ⚠️ **Important Security Note:** Private secrets (`DATABASE_URL`, `DIRECT_URL`, `JWT_SECRET`) are strictly kept on the backend and never exposed in client bundles or git commits.

---

## 📖 Deployment Guide

For full production deployment instructions to **Vercel** (Frontend), **Render** (Backend), and **Supabase** (Database), refer to [DEPLOYMENT.md](DEPLOYMENT.md).

---

## 📄 License
MIT License - VOZX Ecosystem.
