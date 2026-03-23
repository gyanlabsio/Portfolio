# Deployment Guide

## Final Check Status
- Frontend lint/build/e2e: pass in latest verified run.
- Backend runtime: starts successfully and connects to Atlas using direct Mongo URI fallback.
- Editor diagnostics: no current Problems panel errors.

## Architecture
- Frontend: Vite React app in `frontend/`
- Backend: Express API in `backend/`
- Database: MongoDB Atlas

## Phase 1: Deploy Backend (Render)
1. Create a new Web Service from `backend/`.
2. Build command:
   - `npm install`
3. Start command:
   - `npm start`
4. Add environment variables:
   - `NODE_ENV=production`
   - `PORT=5000`
   - `MONGO_URI=<your current direct atlas uri>`
   - `JWT_SECRET=<strong random secret>`
   - `JWT_EXPIRE=24h`
   - `CLIENT_URL=<frontend production url>`
   - `CLOUDINARY_CLOUD_NAME=<...>`
   - `CLOUDINARY_API_KEY=<...>`
   - `CLOUDINARY_API_SECRET=<...>`
   - `SMTP_HOST=<...>`
   - `SMTP_PORT=<...>`
   - `SMTP_USER=<...>`
   - `SMTP_PASS=<...>`
   - `CONTACT_EMAIL=<...>`
   - `SEED_ADMIN_EMAIL=<your fixed admin email>`
   - `SEED_ADMIN_PASSWORD=<your fixed admin password>`
5. Deploy and verify:
   - `GET /api/health`
   - `GET /api/config`

## Phase 2: Seed Admin on Production
1. Open Render Shell for backend service.
2. Run:
   - `npm run seed`
3. This enforces single-admin mode from env variables.

## Phase 3: Deploy Frontend (Vercel)
1. Import repository and set Root Directory to `frontend`.
2. Build command:
   - `npm run build`
3. Output directory:
   - `dist`
4. Add environment variable:
   - `VITE_API_URL=<your backend production url>/api`
5. Deploy.

## Phase 4: Wire CORS and Cookies
1. Set backend `CLIENT_URL` to your frontend exact domain.
2. Redeploy backend.
3. Test login at `/admin/login`.

## Phase 5: Post-Deploy Smoke Test
1. Open public site.
2. Confirm projects/blog load.
3. Login admin with fixed account.
4. Create one project in admin.
5. Submit contact form and verify mail behavior.

## Security Notes Before Going Live
1. Rotate all secrets currently stored in local `.env`.
2. Keep `.env` out of git history.
3. Use app-password or provider SMTP keys only.
4. Keep `SEED_ADMIN_PASSWORD` strong and private.

## Temporary Admin Seeding (No CLI Needed)
If you cannot use Render Shell or CLI, use this method:

1. **Set a strong secret token in your backend environment variables:**
   - `SEED_ADMIN_TOKEN=<your strong random token>`
2. **Redeploy your backend** so the new token is active.
3. **Trigger the seed via HTTP:**
   - Send a POST request to:

     ```
     https://<your-backend-domain>/api/config/seed-admin?token=<your strong random token>
     ```
   - Example using `curl`:
     ```sh
     curl -X POST "https://<your-backend-domain>/api/config/seed-admin?token=<your strong random token>"
     ```
   - Or use Postman/Insomnia with a POST request to the same URL.
4. **Check for `{ message: 'Admin seeded successfully' }` in the response.**
5. **Remove or disable this route after seeding for security.**

> This method works on any host (Render, Railway, Fly.io, etc.) and does not require shell access.
