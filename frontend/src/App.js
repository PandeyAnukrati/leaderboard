import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Components
import UserSelector from "./components/UserSelector";
import ClaimButton from "./components/ClaimButton";
import Leaderboard from "./components/Leaderboard";
import PointHistory from "./components/PointHistory";
import ConnectionStatus from "./components/ConnectionStatus";

// Services
import { userService } from "./services/api";
import socketService from "./services/socket";

// Icons
import { Trophy, Users, History, Zap } from "lucide-react";

/**
 * Main App Component
 * Manages the entire leaderboard application state and real-time updates
 */
function App() {
  // State management
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [claimLoading, setClaimLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("leaderboard");
  const [lastUpdate, setLastUpdate] = useState(null);

  // Fetch all users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await userService.getAllUsers();
      setUsers(response.data);

      // Update selected user if it exists
      if (selectedUser) {
        const updatedSelectedUser = response.data.find(
          (u) => u._id === selectedUser._id
        );
        setSelectedUser(updatedSelectedUser || null);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle user selection
  const handleUserSelect = (user) => {
    setSelectedUser(user);
    if (user) {
      toast.info(`Selected ${user.name} for point claiming`);
    }
  };

  // Handle adding new user
  const handleAddUser = async (userName) => {
    try {
      const response = await userService.createUser({ name: userName });
      toast.success(`User "${userName}" added successfully!`);

      // Refresh users list
      await fetchUsers();

      return response.data;
    } catch (error) {
      console.error("Error adding user:", error);
      toast.error("Failed to add user: " + error.message);
      throw error;
    }
  };

  // Handle claiming points
  const handleClaimPoints = async (userId) => {
    try {
      setClaimLoading(true);
      const response = await userService.claimPoints(userId);

      // Show success message
      toast.success(response.message);

      // Refresh users list to get updated rankings
      await fetchUsers();

      setLastUpdate(new Date());
      return response;
    } catch (error) {
      console.error("Error claiming points:", error);
      toast.error("Failed to claim points: " + error.message);
      throw error;
    } finally {
      setClaimLoading(false);
    }
  };

  // Handle real-time leaderboard updates
  const handleLeaderboardUpdate = (data) => {
    console.log("Received real-time update:", data);

    if (data.users) {
      setUsers(data.users);

      // Update selected user if it exists
      if (selectedUser && data.users) {
        const updatedSelectedUser = data.users.find(
          (u) => u._id === selectedUser._id
        );
        setSelectedUser(updatedSelectedUser || null);
      }
    }

    if (data.lastClaim) {
      const { user, pointsAwarded } = data.lastClaim;
      toast.info(`🎉 ${user.name} just claimed ${pointsAwarded} points!`, {
        position: "top-center",
        autoClose: 3000,
      });
    }

    setLastUpdate(new Date());
  };

  // Initialize app
  useEffect(() => {
    // Initial data load
    fetchUsers();

    // Connect to socket for real-time updates
    const socket = socketService.connect();

    // Listen for leaderboard updates
    socketService.onLeaderboardUpdate(handleLeaderboardUpdate);

    // Cleanup on unmount
    return () => {
      socketService.offLeaderboardUpdate(handleLeaderboardUpdate);
      socketService.disconnect();
    };
  }, []);

  // Tab configuration
  const tabs = [
    { id: "leaderboard", label: "Leaderboard", icon: Trophy },
    { id: "history", label: "Point History", icon: History },
  ];

  return (
    <div className="App">
      {/* Connection Status */}
      <ConnectionStatus />

      {/* Header */}
      <header className="container">
        <div className="text-center mb-4">
          <h1
            className="mb-2"
            style={{ fontSize: "2.5rem", fontWeight: "bold", color: "white" }}
          >
            🏆 Dynamic Leaderboard System
          </h1>
          <p
            className="text-white"
            style={{ fontSize: "1.1rem", opacity: 0.9 }}
          >
            Select users, claim random points, and watch the rankings update in
            real-time!
          </p>
          {lastUpdate && (
            <p
              className="text-white"
              style={{ fontSize: "0.9rem", opacity: 0.7 }}
            >
              Last updated: {lastUpdate.toLocaleTimeString()}
            </p>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="container">
        {/* User Selection and Claim Section */}
        <div className="grid grid-2 mb-4">
          <UserSelector
            users={users}
            selectedUser={selectedUser}
            onUserSelect={handleUserSelect}
            onAddUser={handleAddUser}
            loading={loading}
          />

          <ClaimButton
            selectedUser={selectedUser}
            onClaimPoints={handleClaimPoints}
            loading={claimLoading}
            disabled={loading}
          />
        </div>

        {/* Tab Navigation */}
        <div className="card mb-4">
          <div className="d-flex justify-content-center gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  className={`btn ${
                    activeTab === tab.id ? "btn-primary" : "btn-secondary"
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                  style={{ minWidth: "150px" }}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === "leaderboard" && (
            <Leaderboard users={users} loading={loading} />
          )}

          {activeTab === "history" && <PointHistory />}
        </div>

        {/* Stats Summary */}
        <div className="card mt-4">
          <h4 className="mb-3 text-center">📊 System Statistics</h4>
          <div className="d-flex justify-content-around text-center">
            <div>
              <div className="d-flex align-items-center justify-content-center gap-2 mb-2">
                <Users size={20} className="text-primary" />
                <span
                  style={{
                    fontSize: "24px",
                    fontWeight: "bold",
                    color: "#667eea",
                  }}
                >
                  {users.length}
                </span>
              </div>
              <div style={{ fontSize: "14px", color: "#666" }}>Total Users</div>
            </div>

            <div>
              <div className="d-flex align-items-center justify-content-center gap-2 mb-2">
                <Zap size={20} className="text-success" />
                <span
                  style={{
                    fontSize: "24px",
                    fontWeight: "bold",
                    color: "#28a745",
                  }}
                >
                  {users.reduce((sum, user) => sum + user.totalPoints, 0)}
                </span>
              </div>
              <div style={{ fontSize: "14px", color: "#666" }}>
                Total Points
              </div>
            </div>

            <div>
              <div className="d-flex align-items-center justify-content-center gap-2 mb-2">
                <Trophy size={20} className="text-warning" />
                <span
                  style={{
                    fontSize: "24px",
                    fontWeight: "bold",
                    color: "#ffc107",
                  }}
                >
                  {users.length > 0 ? users[0]?.name || "N/A" : "N/A"}
                </span>
              </div>
              <div style={{ fontSize: "14px", color: "#666" }}>
                Current Leader
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mt-5">
        <div className="text-center text-white" style={{ opacity: 0.8 }}>
          <p>Built with React.js, Node.js, MongoDB & Socket.IO</p>
          <p style={{ fontSize: "0.9rem" }}>
            Real-time leaderboard system with dynamic rankings and point history
            tracking
          </p>
        </div>
      </footer>

      {/* Toast Notifications */}
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

export default App;
