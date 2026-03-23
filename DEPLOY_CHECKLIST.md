# Deploy Checklist

## 1. GitHub
Upload this repo so the root contains:
- backend/
- frontend/
- render.yaml
- schema.sql
- .env.example

## 2. Neon
- Create a Neon project
- Run `schema.sql`
- Copy the connection string

## 3. Render backend
- New -> Web Service
- Root Directory: `backend`
- Build Command: `npm install`
- Start Command: `npm start`
- Add env vars:
  - `DATABASE_URL`
  - `FRONTEND_URL`
  - `NODE_ENV=production`
  - `JWT_SECRET`

## 4. Render frontend
- New -> Static Site
- Root Directory: `frontend`
- Build Command: `npm install && npm run build`
- Publish Directory: `dist`
- Add env var:
  - `VITE_API_BASE_URL=https://your-backend-service.onrender.com`

## 5. Final
- Open backend `/health`
- Open backend `/api/properties`
- Redeploy frontend after setting `VITE_API_BASE_URL`
