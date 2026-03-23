# RentConnect NG - Render Ready Repo

This repo contains a fresh full-stack starter for a Lagos apartment rental hub.

## Structure

```text
backend/
frontend/
render.yaml
schema.sql
.env.example
```

## Frontend

Vite + React app.

### Local run

```bash
cd frontend
npm install
npm run dev
```

## Backend

Express + PostgreSQL app.

### Local run

Create `backend/.env` first.

```env
DATABASE_URL=your_neon_connection_string
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
PORT=10000
```

Then run:

```bash
cd backend
npm install
npm start
```

## Neon setup

Run `schema.sql` in Neon to create the `properties` table and seed sample data.

## Render deployment

### Backend Web Service
- Root Directory: `backend`
- Build Command: `npm install`
- Start Command: `npm start`

Environment variables:
- `DATABASE_URL`
- `FRONTEND_URL`
- `NODE_ENV=production`
- `JWT_SECRET`

### Frontend Static Site
- Root Directory: `frontend`
- Build Command: `npm install && npm run build`
- Publish Directory: `dist`

Environment variables:
- `VITE_API_BASE_URL=https://your-backend-service.onrender.com`
