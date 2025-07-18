import { io } from "socket.io-client";

/**
 * Socket.IO client configuration and service
 */
class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
  }

  // Initialize socket connection
  connect() {
    if (this.socket) {
      return this.socket;
    }

    this.socket = io(
      process.env.REACT_APP_BACKEND_URL,
      {
        transports: ["websocket", "polling"],
        timeout: 20000,
        forceNew: true,
      }
    );

    // Connection event handlers
    this.socket.on("connect", () => {
      console.log("✅ Connected to server:", this.socket.id);
      this.isConnected = true;
      this.joinLeaderboard();
    });

    this.socket.on("disconnect", (reason) => {
      console.log("❌ Disconnected from server:", reason);
      this.isConnected = false;
    });

    this.socket.on("connect_error", (error) => {
      console.error("🔴 Connection error:", error);
      this.isConnected = false;
    });

    this.socket.on("reconnect", (attemptNumber) => {
      console.log("🔄 Reconnected after", attemptNumber, "attempts");
      this.isConnected = true;
      this.joinLeaderboard();
    });

    this.socket.on("reconnect_error", (error) => {
      console.error("🔴 Reconnection error:", error);
    });

    return this.socket;
  }

  // Join leaderboard room for real-time updates
  joinLeaderboard() {
    if (this.socket && this.isConnected) {
      this.socket.emit("joinLeaderboard");
      console.log("📊 Joined leaderboard room");
    }
  }

  // Leave leaderboard room
  leaveLeaderboard() {
    if (this.socket && this.isConnected) {
      this.socket.emit("leaveLeaderboard");
      console.log("📊 Left leaderboard room");
    }
  }

  // Subscribe to leaderboard updates
  onLeaderboardUpdate(callback) {
    if (this.socket) {
      this.socket.on("leaderboardUpdate", callback);
    }
  }

  // Unsubscribe from leaderboard updates
  offLeaderboardUpdate(callback) {
    if (this.socket) {
      this.socket.off("leaderboardUpdate", callback);
    }
  }

  // Subscribe to any custom event
  on(event, callback) {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  // Unsubscribe from any custom event
  off(event, callback) {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  // Emit custom event
  emit(event, data) {
    if (this.socket && this.isConnected) {
      this.socket.emit(event, data);
    }
  }

  // Disconnect socket
  disconnect() {
    if (this.socket) {
      this.leaveLeaderboard();
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      console.log("🔌 Socket disconnected");
    }
  }

  // Get connection status
  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      socketId: this.socket?.id || null,
    };
  }
}

// Create singleton instance
const socketService = new SocketService();

export default socketService;
