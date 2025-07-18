const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/database");
const userRoutes = require("./routes/userRoutes");
const socketMiddleware = require("./middleware/socketMiddleware");

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

// Create Express app
const app = express();
const server = http.createServer(app);

// Setup Socket.IO with CORS
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Middleware
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Socket middleware to make io available in routes
app.use(socketMiddleware(io));

// Routes
app.use("/api/users", userRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Leaderboard API is running!",
    timestamp: new Date().toISOString(),
  });
});

// Socket.IO connection handling
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Handle user joining leaderboard room
  socket.on("joinLeaderboard", () => {
    socket.join("leaderboard");
    console.log(`User ${socket.id} joined leaderboard room`);
  });

  // Handle user leaving leaderboard room
  socket.on("leaveLeaderboard", () => {
    socket.leave("leaderboard");
    console.log(`User ${socket.id} left leaderboard room`);
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong!",
    error:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Internal server error",
  });
});

// Handle 404 routes
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Leaderboard API available at http://localhost:${PORT}`);
  console.log(`🔌 Socket.IO server running for real-time updates`);
});
