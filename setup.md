# 🚀 Quick Setup Guide

## Prerequisites

- Node.js (v14 or higher) - [Download here](https://nodejs.org/)
- MongoDB - [Download here](https://www.mongodb.com/try/download/community) or use MongoDB Atlas
- Git (optional)

## Step-by-Step Setup

### 1. Install Dependencies

**Backend:**

```bash
cd backend
npm install
```

**Frontend:**

```bash
cd frontend
npm install
```

### 2. Setup MongoDB

**Option A: Local MongoDB**

- Install MongoDB Community Edition
- Start MongoDB service
- MongoDB will run on `mongodb://localhost:27017`

**Option B: MongoDB Atlas (Cloud)**

- Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
- Create a cluster
- Get connection string
- Update `.env` file with your connection string

### 3. Environment Configuration

The `.env` file in the backend directory is already configured for local development:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/leaderboard
NODE_ENV=development
```

### 4. Seed Initial Data

```bash
cd backend
npm run seed
```

This will create 10 initial users: Rahul, Kamal, Sanak, Priya, Amit, Sneha, Vikram, Anita, Rajesh, Meera

### 5. Start the Application

**Terminal 1 - Backend:**

```bash
cd backend
npm run dev
```

Backend will run on: http://localhost:5000

**Terminal 2 - Frontend:**

```bash
cd frontend
npm start
```

Frontend will run on: http://localhost:3000

### 6. Test the Application

1. Open http://localhost:3000 in your browser
2. Select a user from the dropdown
3. Click "Claim Random Points" button
4. Watch the leaderboard update in real-time
5. Check the "Point History" tab to see all claims
6. Try adding new users using the "Add User" button

## 🎯 Features to Test

### Core Features

- ✅ User selection dropdown
- ✅ Add new users
- ✅ Claim random points (1-10)
- ✅ Real-time leaderboard updates
- ✅ Dynamic ranking calculation
- ✅ Point history tracking

### Advanced Features

- ✅ Real-time updates via Socket.IO
- ✅ Responsive design
- ✅ Toast notifications
- ✅ Connection status indicator
- ✅ Pagination for history
- ✅ Top 3 podium display
- ✅ Animated UI elements

## 🔧 Troubleshooting

### MongoDB Connection Issues

```bash
# Check if MongoDB is running
mongosh

# If using Windows, start MongoDB service
net start MongoDB
```

### Port Already in Use

```bash
# Kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID_NUMBER> /F

# Kill process on port 3000
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F
```

### Dependencies Issues

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules
npm install
```

## 📱 API Testing

You can test the API endpoints using tools like Postman or curl:

```bash
# Health check
curl http://localhost:5000/api/health

# Get all users
curl http://localhost:5000/api/users

# Create user
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User"}'

# Claim points
curl -X POST http://localhost:5000/api/users/{userId}/claim

# Get leaderboard
curl http://localhost:5000/api/users/leaderboard

# Get point history
curl http://localhost:5000/api/users/history
```

## 🎨 UI Features

- **Modern Design**: Gradient backgrounds, smooth animations
- **Responsive Layout**: Works on desktop, tablet, and mobile
- **Real-time Updates**: Live leaderboard changes
- **Visual Feedback**: Loading states, hover effects
- **Toast Notifications**: Success/error messages
- **Connection Status**: Real-time connection indicator

## 📊 Database Collections

### Users Collection

- name (String, required)
- totalPoints (Number, default: 0)
- rank (Number)
- timestamps

### PointHistory Collection

- userId (ObjectId, ref: User)
- userName (String)
- pointsAwarded (Number, 1-10)
- previousTotal (Number)
- newTotal (Number)
- claimedAt (Date)
- timestamps

## 🚀 Production Deployment

### Backend

1. Set production environment variables
2. Use PM2 for process management
3. Configure reverse proxy (nginx)
4. Use MongoDB Atlas for production database

### Frontend

1. Run `npm run build`
2. Deploy to static hosting (Netlify, Vercel, etc.)
3. Update API URLs for production

---

**Happy coding! 🎉**
