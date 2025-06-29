# Deployment Guide

## Overview
This app consists of two parts:
- **Frontend**: React app (deploy to Vercel)
- **Backend**: Node.js/Express API (deploy to Railway/Render/Heroku)

## Backend Deployment

### Option 1: Railway (Recommended)
1. Go to [railway.app](https://railway.app)
2. Connect your GitHub account
3. Create new project from GitHub repo
4. Select the `backend` folder
5. Add environment variables:
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   CORS_ORIGIN=https://your-frontend-domain.vercel.app
   NODE_ENV=production
   ```
6. Deploy

### Option 2: Render
1. Go to [render.com](https://render.com)
2. Create new Web Service
3. Connect GitHub repo
4. Set build command: `npm install`
5. Set start command: `node server.js`
6. Add environment variables (same as above)
7. Deploy

### Option 3: Heroku
1. Install Heroku CLI
2. Create new app: `heroku create your-app-name`
3. Add MongoDB addon: `heroku addons:create mongolab`
4. Set environment variables:
   ```bash
   heroku config:set JWT_SECRET=your_jwt_secret
   heroku config:set CORS_ORIGIN=https://your-frontend-domain.vercel.app
   heroku config:set NODE_ENV=production
   ```
5. Deploy: `git push heroku main`

## Frontend Deployment (Vercel)

1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Set root directory to `sidebet`
4. Add environment variable:
   ```
   REACT_APP_API_BASE_URL=https://your-backend-url.com/api
   ```
5. Deploy

## Environment Variables

### Backend (.env)
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/sidebet
JWT_SECRET=your_super_secret_jwt_key
CORS_ORIGIN=https://your-frontend-domain.vercel.app
NODE_ENV=production
PORT=5000
```

### Frontend (Vercel Environment Variables)
```
REACT_APP_API_BASE_URL=https://your-backend-url.com/api
```

## Database Setup

1. Create MongoDB Atlas account
2. Create new cluster
3. Get connection string
4. Add to backend environment variables

## Testing Deployment

1. Test backend health: `https://your-backend-url.com/health`
2. Test frontend: Visit your Vercel URL
3. Test registration/login flow
4. Test bet creation and acceptance

## Troubleshooting

### CORS Issues
- Ensure `CORS_ORIGIN` matches your frontend URL exactly
- Include protocol (https://)

### Database Connection
- Check MongoDB connection string
- Ensure IP whitelist includes deployment platform

### Environment Variables
- Verify all variables are set correctly
- Check for typos in variable names

### Build Issues
- Ensure all dependencies are in package.json
- Check for missing environment variables 