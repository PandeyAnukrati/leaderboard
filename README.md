# 🏆 Dynamic Leaderboard System

A full-stack real-time leaderboard application built with React.js frontend and Node.js backend, featuring dynamic rankings, point claiming, and comprehensive history tracking.

## 🌟 Features

### Core Functionality

- **User Management**: Select from existing users or add new ones
- **Random Point Claiming**: Award 1-10 random points to selected users
- **Real-time Rankings**: Dynamic leaderboard updates with live rankings
- **Point History**: Complete tracking of all point claims with pagination
- **Real-time Updates**: Socket.IO powered live updates across all connected clients

### Advanced Features

- **Responsive Design**: Modern, mobile-friendly UI
- **Pagination**: Efficient data loading for large datasets
- **Connection Status**: Real-time connection monitoring
- **Toast Notifications**: User-friendly feedback system
- **Animated UI**: Smooth transitions and visual feedback
- **Top 3 Podium**: Special display for top performers

## 🛠️ Technology Stack

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **Socket.IO** - Real-time communication
- **CORS** - Cross-origin resource sharing

### Frontend

- **React.js** - UI framework
- **Axios** - HTTP client
- **Socket.IO Client** - Real-time updates
- **React Toastify** - Notifications
- **Lucide React** - Icons
- **CSS3** - Styling with gradients and animations

## 📁 Project Structure

```
leaderboard-assignment/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   └── userController.js
│   ├── middleware/
│   │   └── socketMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   └── PointHistory.js
│   ├── routes/
│   │   └── userRoutes.js
│   ├── scripts/
│   │   └── seedUsers.js
│   ├── .env
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   │   ├── index.html
│   │   └── manifest.json
│   ├── src/
│   │   ├── components/
│   │   │   ├── ClaimButton.js
│   │   │   ├── ConnectionStatus.js
│   │   │   ├── Leaderboard.js
│   │   │   ├── PointHistory.js
│   │   │   └── UserSelector.js
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   └── socket.js
│   │   ├── App.js
│   │   ├── index.css
│   │   └── index.js
│   └── package.json
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd leaderboard-assignment
   ```

2. **Setup Backend**

   ```bash
   cd backend
   npm install
   ```

3. **Setup Frontend**

   ```bash
   cd ../frontend
   npm install
   ```

4. **Configure Environment**

   Create `.env` file in backend directory:

   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/leaderboard
   NODE_ENV=development
   ```

5. **Start MongoDB**

   Make sure MongoDB is running on your system.

6. **Seed Initial Data**

   ```bash
   cd backend
   npm run seed
   ```

7. **Start the Application**

   Terminal 1 (Backend):

   ```bash
   cd backend
   npm run dev
   ```

   Terminal 2 (Frontend):

   ```bash
   cd frontend
   npm start
   ```

8. **Access the Application**

   Open your browser and navigate to: `http://localhost:3000`

## 📊 Database Schema

### User Collection

```javascript
{
  _id: ObjectId,
  name: String (required, 2-50 chars),
  totalPoints: Number (default: 0),
  rank: Number (default: 0),
  createdAt: Date,
  updatedAt: Date
}
```

### PointHistory Collection

```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  userName: String,
  pointsAwarded: Number (1-10),
  previousTotal: Number,
  newTotal: Number,
  claimedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## 🔌 API Endpoints

### Users

- `GET /api/users` - Get all users
- `POST /api/users` - Create new user
- `POST /api/users/:userId/claim` - Claim points for user
- `GET /api/users/leaderboard` - Get paginated leaderboard
- `GET /api/users/history` - Get point claim history

### Health Check

- `GET /api/health` - API health status

## 🎮 How to Use

1. **Select a User**: Choose from the dropdown or add a new user
2. **Claim Points**: Click the "Claim Random Points" button
3. **View Rankings**: Watch the leaderboard update in real-time
4. **Check History**: Switch to the "Point History" tab to see all claims
5. **Real-time Updates**: Multiple users can interact simultaneously

## 🎨 UI Features

- **Modern Design**: Clean, gradient-based interface
- **Responsive Layout**: Works on desktop, tablet, and mobile
- **Visual Feedback**: Animations, hover effects, and loading states
- **Real-time Status**: Connection indicator in top-right corner
- **Toast Notifications**: Success/error messages
- **Podium Display**: Special top-3 visualization

## 🔧 Development

### Available Scripts

**Backend:**

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run seed` - Seed database with initial users

**Frontend:**

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests

### Code Quality Features

- **Error Handling**: Comprehensive error management
- **Input Validation**: Server-side and client-side validation
- **Code Comments**: Well-documented codebase
- **Modular Structure**: Reusable components and services
- **Best Practices**: Following React and Node.js conventions

## 🚀 Deployment

### Backend Deployment

1. Set production environment variables
2. Use PM2 or similar process manager
3. Configure reverse proxy (nginx)
4. Set up MongoDB Atlas for production database

### Frontend Deployment

1. Run `npm run build`
2. Deploy build folder to static hosting (Netlify, Vercel, etc.)
3. Update API URLs for production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request


## 🙏 Acknowledgments

- React.js team for the amazing framework
- Socket.IO for real-time capabilities
- MongoDB for flexible data storage
- Lucide React for beautiful icons

---

**Built with ❤️ for dynamic leaderboard management**
