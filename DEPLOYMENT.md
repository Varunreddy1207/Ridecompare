# VOZX RideCompare - Production Deployment Guide

> **Architecture:**
> `USER` ➔ `PUBLIC VOZX FRONTEND (Vercel)` ➔ `PUBLIC VOZX BACKEND API (Render)` ➔ `PRISMA ORM` ➔ `SUPABASE POSTGRESQL`

---

## Architecture Overview

```
                      +-----------------------------+
                      |         End User            |
                      |   (Mobile / Tablet / PC)    |
                      +--------------+--------------+
                                     | HTTPS
                                     v
                      +-----------------------------+
                      |     Vercel Deployment       |
                      |   VOZX RideCompare Frontend |
                      |    (HTML5 / Tailwind / JS)  |
                      +--------------+--------------+
                                     | HTTPS API calls
                                     v
                      +-----------------------------+
                      |     Render Web Service      |
                      | VOZX Node.js + Express API  |
                      |    (TypeScript / JWT Auth)  |
                      +--------------+--------------+
                                     | Prisma ORM
                                     v
                      +-----------------------------+
                      |    Supabase PostgreSQL      |
                      |    Cloud Relational DB      |
                      +-----------------------------+
```

---

## A. GitHub Setup

1. **Commit and Push Code to GitHub:**
   Ensure all local changes are committed and pushed to your remote GitHub repository (`main` branch):
   ```bash
   git status
   git add .
   git commit -m "chore: prepare VOZX RideCompare for Vercel & Render production deployment"
   git push origin main
   ```
2. Verify that your `.gitignore` is active so that `backend/.env`, `node_modules/`, and build artifacts are **never** committed to GitHub.

---

## B. Supabase Setup (Database)

1. Open your [Supabase Dashboard](https://supabase.com/dashboard).
2. Go to **Project Settings** ➔ **Database**.
3. Under **Connection string**, obtain:
   - **Transaction Pooler (Port 6543):** Used for runtime database queries (`DATABASE_URL`).
     ```
     postgresql://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true
     ```
   - **Direct Connection (Port 5432 / Session mode):** Used for Prisma schema migrations (`DIRECT_URL`).
     ```
     postgresql://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres
     ```
4. Verify your database password is correct and test that tables (`User`, `RideSearch`, `RideQuote`, `RideHistory`, `SavedLocation`, `Notification`) exist.

---

## C. Backend Deployment on Vercel

You can deploy the backend API directly to Vercel as an Express Serverless Function running on Node.js 24.x:

1. Log in to [Vercel Dashboard](https://vercel.com/dashboard).
2. Click **Add New...** ➔ **Project**.
3. Import your GitHub repository: `Ridecompare`.
4. Configure the Project:
   - **Project Name:** `vozx-ridecompare-api`
   - **Framework Preset:** `Other`
   - **Root Directory:** `backend` *(Click Edit and select the `backend` folder)*
   - **Build Command:** `npm run build` *(Runs `prisma generate && tsc`)*
   - **Output Directory:** **Leave Empty / Default** *(Override toggle turned OFF; do NOT set to N/A or custom)*
   - **Install Command:** `npm install`
   - **Node.js Version:** `24.x` *(configured in `backend/package.json` engines)*
5. Configure **Environment Variables** in Vercel:
   | Key | Value | Description |
   | :--- | :--- | :--- |
   | `NODE_ENV` | `production` | Enables production error handling |
   | `DATABASE_URL` | `postgresql://postgres.[REF]:[PASS]@[HOST]:6543/postgres?pgbouncer=true` | Supabase pooled connection string |
   | `DIRECT_URL` | `postgresql://postgres.[REF]:[PASS]@[HOST]:5432/postgres` | Supabase direct connection string |
   | `JWT_SECRET` | *(32+ char random string)* | JWT signing secret |
   | `JWT_EXPIRES_IN` | `7d` | Token lifetime |
   | `FRONTEND_URL` | `https://YOUR-FRONTEND-DOMAIN.vercel.app` | Allowed CORS origin |
6. Click **Deploy**.
7. Once deployed, test health: `https://vozx-ridecompare-api.vercel.app/api/health`.

---

## D. Backend Deployment on Render (Alternative)

1. Log in to [Render Dashboard](https://dashboard.render.com/).
2. Click **New +** ➔ **Web Service**.
3. Connect your GitHub repository: `https://github.com/Varunreddy1207/Ridecompare`.
4. Configure the Web Service settings:
   - **Name:** `vozx-ridecompare-api` (or your preferred name)
   - **Region:** Choose the region closest to your Supabase project (e.g., Singapore, Frankfurt, US East).
   - **Branch:** `main`
   - **Root Directory:** `backend`
   - **Runtime:** `Node`
   - **Build Command:**
     ```bash
     npm install && npm run build
     ```
     *(This automatically runs `prisma generate` followed by `tsc`)*
   - **Start Command:**
     ```bash
     npm start
     ```
     *(Runs `node dist/server.js`)*
   - **Instance Type:** `Free` (or higher tier)

5. Configure **Environment Variables** in Render:
   | Key | Recommended Value | Description |
   | :--- | :--- | :--- |
   | `NODE_ENV` | `production` | Enables production optimizations and sanitized errors |
   | `PORT` | `5000` | (Render will automatically assign its port) |
   | `DATABASE_URL` | `postgresql://postgres.[REF]:[PASS]@[HOST]:6543/postgres?pgbouncer=true` | Supabase pooled connection string |
   | `DIRECT_URL` | `postgresql://postgres.[REF]:[PASS]@[HOST]:5432/postgres` | Supabase direct connection string |
   | `JWT_SECRET` | *(Generate a 32+ character random string)* | Secure secret for signing auth tokens |
   | `JWT_EXPIRES_IN` | `7d` | Token lifetime |
   | `FRONTEND_URL` | `https://YOUR-FRONTEND-DOMAIN.vercel.app` | Allowed CORS origin (Vercel domain) |

6. Click **Create Web Service**. Wait for the build and deployment to complete.
7. Once live, Render will assign your backend a public URL:
   `https://YOUR-BACKEND-DOMAIN.onrender.com`

---

## D. Frontend Deployment (Vercel)

1. Log in to [Vercel Dashboard](https://vercel.com/dashboard).
2. Click **Add New...** ➔ **Project**.
3. Import your GitHub repository: `Ridecompare`.
4. Configure the Project:
   - **Project Name:** `vozx-ridecompare`
   - **Framework Preset:** `Vite` (or `Other`)
   - **Root Directory:** `./` (leave as root)
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
5. Configure **Environment Variables** in Vercel:
   | Key | Value |
   | :--- | :--- |
   | `VITE_API_URL` | `https://YOUR-BACKEND-DOMAIN.onrender.com` |
6. Click **Deploy**.
7. Vercel will build the frontend into `dist/` and deploy it to a live global CDN URL:
   `https://YOUR-FRONTEND-DOMAIN.vercel.app`

---

## E. Environment Variables Reference

### Backend (`backend/.env` on Render)
```env
PORT=5000
NODE_ENV=production
DATABASE_URL=postgresql://postgres.xxx:password@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres.xxx:password@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres
JWT_SECRET=production-secret-random-key-32-chars-long
JWT_EXPIRES_IN=7d
FRONTEND_URL=https://YOUR-FRONTEND-DOMAIN.vercel.app
```

> **Security Rule:** Never expose `DATABASE_URL`, `DIRECT_URL`, or `JWT_SECRET` to the frontend or in `VITE_` variables.

### Frontend (`.env` on Vercel)
```env
VITE_API_URL=https://YOUR-BACKEND-DOMAIN.onrender.com
```

---

## F. CORS Configuration

The backend CORS middleware is configured in `backend/src/app.ts`:
- Accepts requests with no origin (mobile applications, Postman, curl).
- Dynamically validates incoming `Origin` headers against:
  1. `FRONTEND_URL` (configured in Render environment variables).
  2. Any `*.vercel.app` domain (automatically allowing Vercel preview and production branches).
  3. Localhost & local network IPs in development mode.
- Supports `credentials: true` for secure cookies/session authentication.
- Rejects unapproved origins safely without crashing.

---

## G. Prisma Deployment

The backend build script in `backend/package.json` is set to:
```json
"build": "prisma generate && tsc"
```
When Render runs `npm run build`:
1. `prisma generate` reads `backend/prisma/schema.prisma` and compiles the Prisma Client into `node_modules/@prisma/client`.
2. `tsc` compiles TypeScript from `src/` to `dist/`.
3. If database schema migrations need to be pushed to Supabase:
   ```bash
   npm run prisma:db:push
   ```

---

## H. Production Testing & Verification

1. **Test Backend Health Endpoint:**
   ```bash
   curl -i https://YOUR-BACKEND-DOMAIN.onrender.com/api/health
   ```
   Expected response:
   ```json
   {
     "success": true,
     "status": "healthy",
     "database": "connected",
     "environment": "production"
   }
   ```
2. **Open Frontend on Vercel:**
   Visit `https://YOUR-FRONTEND-DOMAIN.vercel.app` on desktop, tablet, and mobile.
3. **Verify System Status Panel:**
   Navigate to `https://YOUR-FRONTEND-DOMAIN.vercel.app/#system-status`.
   - Frontend: **Online** (`https://YOUR-FRONTEND-DOMAIN.vercel.app`)
   - Backend API: **Online** (`https://YOUR-BACKEND-DOMAIN.onrender.com/api`)
   - Database: **Connected** (Supabase PostgreSQL / Prisma)
   - Environment: **Production**
4. **Test End-to-End User Journeys:**
   - Sign up with a new account.
   - Log in with credentials (`varunreddy@gmail.com` / `Password123!`).
   - Request ride fare quotes across Uber, Ola, and Rapido.
   - Check profile settings and edit avatar/color themes.

---

## I. Custom Domain Setup (Optional)

### Custom Domain on Vercel:
1. In Vercel Project Settings ➔ **Domains**, add your domain (e.g. `ridecompare.yourdomain.com`).
2. Add the provided `CNAME` or `A` record in your DNS registrar (GoDaddy, Namecheap, Cloudflare).
3. Update `FRONTEND_URL` on Render to include your custom domain:
   `FRONTEND_URL=https://ridecompare.yourdomain.com,https://YOUR-FRONTEND-DOMAIN.vercel.app`

### Custom Domain on Render:
1. In Render Web Service Settings ➔ **Custom Domains**, add your API domain (e.g. `api.yourdomain.com`).
2. Add the `CNAME` pointing to your Render service address.
3. Update `VITE_API_URL` on Vercel to `https://api.yourdomain.com`.

