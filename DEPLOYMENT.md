# ServeLocal - Deployment Guide

This guide will help you deploy the ServeLocal MERN stack application on **Vercel** (Frontend) and **Render** (Backend).

## Prerequisites

- Node.js 18.x (specified in `.nvmrc`)
- MongoDB Atlas account (for production database)
- Vercel account
- Render account

---

## Backend Deployment (Render)

### Step 1: Prepare Backend

1. The backend is located in the `/backend` folder
2. Node version is set to `18.x` in `render.yaml` and `.nvmrc`
3. `engines` field in `package.json` specifies compatible Node versions

### Step 2: Deploy on Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `servelocal-backend`
   - **Root Directory**: `backend`
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Node Version**: `18.x`

### Step 3: Environment Variables

Add these environment variables in Render dashboard:

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `production` |
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://...` |
| `JWT_SECRET` | Secret key for JWT | `your-secret-key` |
| `FRONTEND_URL` | Your Vercel frontend URL | `https://your-app.vercel.app` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | `your-cloud` |
| `CLOUDINARY_API_KEY` | Cloudinary API key | `123456789` |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | `secret` |
| `RAZORPAY_KEY_ID` | Razorpay key ID | `rzp_test_...` |
| `RAZORPAY_KEY_SECRET` | Razorpay secret | `secret` |
| `EMAIL_SERVICE` | Email service | `gmail` |
| `EMAIL_USER` | Email username | `your@gmail.com` |
| `EMAIL_PASS` | Email app password | `app-password` |

---

## Frontend Deployment (Vercel)

### Step 1: Prepare Frontend

1. The frontend is located in the `/frontend` folder
2. Vite is configured with proper build settings in `vite.config.mjs`
3. `vercel.json` is configured for SPA routing

### Step 2: Deploy on Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New Project"**
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
   - **Node Version**: `18.x`

### Step 3: Environment Variables

Add these environment variables in Vercel dashboard:

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `https://servelocal-backend.onrender.com/api` |
| `VITE_SOCKET_URL` | Backend Socket URL | `https://servelocal-backend.onrender.com` |

---

## Common Issues & Solutions

### Node Version Mismatch

**Problem**: Build fails with "React requires Node 18 but version 19 is installed"

**Solution**: 
- `.nvmrc` file specifies Node 18.20.0
- `engines` field in package.json enforces Node >=18.0.0 <21.0.0
- In Vercel/Render dashboard, manually set Node version to 18.x

### Build Output Directory

**Problem**: Vercel shows "404 - Page Not Found"

**Solution**: 
- `vercel.json` has `outputDirectory: "dist"`
- `vite.config.mjs` builds to `dist` folder
- SPA routing is configured in `vercel.json`

### CORS Errors

**Problem**: Frontend can't connect to backend

**Solution**: 
- Set `FRONTEND_URL` in backend to match your Vercel URL
- Backend CORS is configured to accept requests from `FRONTEND_URL`

---

## Post-Deployment Checklist

- [ ] Backend is running and health check passes (`/health` endpoint)
- [ ] Frontend loads without errors
- [ ] API calls from frontend work correctly
- [ ] WebSocket connections work (chat feature)
- [ ] Image uploads work (if Cloudinary configured)
- [ ] Email notifications work (if SMTP configured)
- [ ] Payment integration works (if Razorpay configured)

---

## Support

If you encounter issues:
1. Check Render/Vercel deployment logs
2. Verify all environment variables are set
3. Ensure MongoDB Atlas IP whitelist includes Render's IP
4. Check browser console for frontend errors
