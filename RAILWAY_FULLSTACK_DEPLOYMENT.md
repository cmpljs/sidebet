# Railway Full-Stack Deployment Guide

## Overview
This guide will help you deploy your entire SideBet application (frontend + backend) to Railway as a single service.

## What We've Configured

✅ **Monorepo Structure** - Single deployment for both frontend and backend  
✅ **Static File Serving** - Backend serves React build files in production  
✅ **API Routing** - All API calls go to `/api/*` routes  
✅ **Port Management** - No more port conflicts  
✅ **Build Process** - Automatic frontend build during deployment  

## Deployment Steps

### 1. Railway Setup
1. Go to [railway.app](https://railway.app)
2. Sign up/login with GitHub
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Choose your repository: `cmpljs/sidebet`

### 2. Environment Variables
In Railway dashboard, go to Variables tab and add:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/sidebet
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRE=7d
NODE_ENV=production
```

### 3. Build Configuration
Railway will automatically:
- Install dependencies for the entire monorepo
- Build the React frontend (`npm run build`)
- Start the backend server (`npm start`)
- Serve the built frontend files from the backend

### 4. Database Setup

#### Option A: MongoDB Atlas (Recommended)
1. Create account at [mongodb.com](https://mongodb.com)
2. Create new cluster
3. Get connection string
4. Add to `MONGODB_URI` in Railway variables

#### Option B: Railway MongoDB Plugin
1. In Railway dashboard, go to "New" → "Database" → "MongoDB"
2. Railway will automatically add `MONGODB_URI` to your variables

## How It Works

### Development vs Production
- **Development**: Frontend runs on port 3000, backend on port 5000
- **Production**: Everything runs on one port (Railway's PORT)

### API Calls
- **Development**: `http://localhost:5000/api/*`
- **Production**: `/api/*` (relative to same domain)

### Static Files
- **Development**: React dev server serves frontend
- **Production**: Express serves built React files from `/sidebet/build`

## Testing Your Deployment

1. **Frontend**: Visit your Railway URL
2. **Backend Health**: `https://your-app.railway.app/health`
3. **API Test**: `https://your-app.railway.app/api`
4. **Full App**: Test registration, login, bet creation

## File Structure After Deployment

```
/app (Railway container)
├── package.json (monorepo)
├── railway.json (Railway config)
├── backend/
│   ├── server.js (serves API + static files)
│   └── ...
└── sidebet/
    ├── build/ (React production build)
    └── ...
```

## Troubleshooting

### Build Fails
- Check that all dependencies are in package.json files
- Ensure Node.js version compatibility
- Check Railway logs for specific errors

### Database Connection Fails
- Verify MongoDB connection string
- Check if MongoDB Atlas IP whitelist includes Railway IPs
- Or use Railway's MongoDB plugin

### Frontend Not Loading
- Check that React build completed successfully
- Verify static file serving in backend/server.js
- Check browser console for errors

### API Calls Failing
- Verify API routes are working: `/health` endpoint
- Check CORS configuration
- Ensure environment variables are set correctly

## Advantages of This Setup

✅ **Single Deployment** - One service for everything  
✅ **No CORS Issues** - Same domain for frontend and API  
✅ **Simplified Configuration** - Fewer environment variables  
✅ **Cost Effective** - One service instead of two  
✅ **Easier Management** - Single URL for everything  

## Monitoring

- **Logs**: Check Railway dashboard for real-time logs
- **Health**: Monitor `/health` endpoint
- **Performance**: Railway provides built-in monitoring
- **Scaling**: Automatic scaling based on traffic

## Next Steps

After successful deployment:
1. Test all functionality
2. Set up custom domain (optional)
3. Configure monitoring alerts
4. Set up CI/CD for automatic deployments 