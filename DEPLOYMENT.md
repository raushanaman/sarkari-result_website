# Production Deployment Guide

## Backend Deployment (Render)

1. **Create Render Account**: Sign up at https://render.com
2. **Create Web Service**: 
   - Connect your GitHub repository
   - Select "Web Service"
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`

3. **Environment Variables** (Add in Render Dashboard):
   ```
   MONGODB_URI=mongodb+srv://kcwjan2026_db_user:W1qKg1VDh%40uTudI7j%21@ksjobs.dpxzod0.mongodb.net/sarkari-result?retryWrites=true&w=majority&appName=KSJOBS
   JWT_SECRET=your_super_secure_jwt_secret_key_for_production_minimum_32_characters
   NODE_ENV=production
   PORT=10000
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=your_secure_admin_password
   FRONTEND_URL=https://your-frontend-app.vercel.app
   MAX_FILE_SIZE=10485760
   UPLOAD_PATH=./uploads
   ```

4. **Get Backend URL**: After deployment, copy your Render URL (e.g., https://your-backend-app.onrender.com)

## Frontend Deployment (Vercel)

1. **Update Environment Variables**:
   - Update `frontend/.env.production` with your Render backend URL
   - Set `VITE_API_BASE_URL=https://your-backend-app.onrender.com/api`

2. **Deploy to Vercel**:
   - Connect GitHub repository to Vercel
   - Set Root Directory to `frontend`
   - Vercel will auto-detect Vite configuration
   - Add environment variable in Vercel dashboard:
     ```
     VITE_API_BASE_URL=https://your-backend-app.onrender.com/api
     ```

3. **Update CORS**: After getting Vercel URL, update `FRONTEND_URL` in Render environment variables

## Security Checklist

- [ ] Change JWT_SECRET to a strong 32+ character string
- [ ] Change ADMIN_PASSWORD to a secure password
- [ ] Update FRONTEND_URL with actual Vercel URL
- [ ] Verify CORS settings are working
- [ ] Test all API endpoints
- [ ] Monitor application logs

## Local Development

1. Backend: `cd backend && npm run dev`
2. Frontend: `cd frontend && npm run dev`
3. Ensure `.env` files have localhost URLs for development