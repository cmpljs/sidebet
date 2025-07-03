# SideBet - Application for tracking side bets with your frineds

A full-stack betting application built with React frontend and Node.js backend, featuring user authentication, bet creation, and bet acceptance functionality.

## 🏗️ Project Structure

```
sotka/
├── sidebet/          # React Frontend
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   └── ...
│   └── package.json
├── backend/          # Node.js Backend
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── utils/
│   └── server.js
└── package.json      # Monorepo root
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd sotka
   ```

2. **Install all dependencies**
   ```bash
   npm run install:all
   ```

3. **Set up environment variables**
   
   Create `backend/config.env`:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/sidebet
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRE=7d
   CORS_ORIGIN=http://localhost:3000
   ```

4. **Start MongoDB**
   ```bash
   # Local MongoDB
   mongod
   
   # Or use MongoDB Atlas (update MONGODB_URI in config.env)
   ```

5. **Run the application**
   ```bash
   npm run dev
   ```

This will start both frontend (http://localhost:3000) and backend (http://localhost:5000) simultaneously.

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

#### Login User
```http
POST /api/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Get Current User
```http
GET /api/me
Authorization: Bearer <jwt-token>
```

### Bet Management Endpoints

#### Create Bet
```http
POST /api/bets
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "name": "Lakers vs Warriors",
  "description": "Who will win the game?",
  "size": 50.00
}
```

#### Get Single Bet
```http
GET /api/bets/:id
```

#### Accept Bet
```http
POST /api/bets/:id/accept
Authorization: Bearer <jwt-token>
```

#### Get User's Bets
```http
GET /api/my-bets?type=all|created|accepted
Authorization: Bearer <jwt-token>
```

#### Get All Bets (Admin)
```http
GET /api/bets?page=1&limit=10&status=pending
Authorization: Bearer <jwt-token>
```

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Styling
- **Context API** - State management
- **LocalStorage** - Client-side persistence

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation
- **CORS** - Cross-origin resource sharing
- **Helmet** - Security headers
- **Morgan** - HTTP request logging

## 🔧 Development

### Available Scripts

#### Root Level
```bash
npm run dev              # Start both frontend and backend in development
npm run dev:frontend     # Start only frontend
npm run dev:backend      # Start only backend
npm run install:all      # Install dependencies for all packages
```

#### Frontend (sidebet/)
```bash
npm start               # Start development server
npm run build          # Build for production
npm test               # Run tests
```

#### Backend (backend/)
```bash
npm run dev            # Start with nodemon (development)
npm start              # Start production server
```

### Environment Variables

#### Backend (.env or config.env)
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/sidebet
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:3000
```

## 🗄️ Database Schema

### User Model
```javascript
{
  email: String (unique, required),
  password: String (hashed, required),
  name: String (required),
  createdAt: Date,
  lastLogin: Date
}
```

### Bet Model
```javascript
{
  name: String (required),
  description: String (required),
  size: Number (required),
  creator: ObjectId (ref: User),
  acceptedBy: ObjectId (ref: User),
  status: String (enum: pending, accepted, completed, cancelled),
  createdAt: Date,
  acceptedAt: Date,
  completedAt: Date
}
```

## 🔒 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - bcrypt with salt rounds
- **Input Validation** - Comprehensive validation using express-validator
- **CORS Protection** - Configured for frontend domain
- **Security Headers** - Helmet.js for security headers
- **Error Handling** - Global error handling with proper status codes

## 🎨 Frontend Features

- **Responsive Design** - Works on mobile and desktop
- **Dark Theme** - Modern dark blue/black/gray color scheme
- **Real-time Updates** - Immediate UI updates on data changes
- **Form Validation** - Client-side and server-side validation
- **Shareable Links** - Copy-to-clipboard functionality for bet links 
