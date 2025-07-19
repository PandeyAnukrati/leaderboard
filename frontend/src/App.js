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
    <div className="App" style={{ position: "relative", minHeight: "100vh", background: "linear-gradient(180deg, #181a20 0%, #232946 60%, #232946 100%)", marginTop: "-20px", marginBottom: "-20px" }}>
      {/* Game-like Adventure Background with Reward Elements */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
        overflow: "hidden"
      }}>
        {/* Stars */}
        {[...Array(40)].map((_, i) => {
          const size = Math.random() * 12 + 8;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                top: `${Math.random() * 60 + 2}%`,
                left: `${Math.random() * 100}%`,
                width: `${size}px`,
                height: `${size}px`,
                background: "#fff",
                borderRadius: "50%",
                opacity: Math.random() * 0.6 + 0.3,
                boxShadow: `0 0 ${size * 1.2}px #fff, 0 0 ${size * 2}px #fff2`,
                animation: `twinkle ${Math.random() * 2 + 1.5}s infinite alternate`,
              }}
            />
          );
        })}
        {/* Reward SVGs: Trophy, Medal, Crown, Star */}
        <svg width="100%" height="100%" style={{ position: "absolute", top: 0, left: 0, zIndex: 0, pointerEvents: "none" }}>
          {/* Trophy */}
          <g opacity="0.18">
            <circle cx="90" cy="120" r="38" fill="#ffd700" />
            <rect x="75" y="120" width="30" height="18" rx="8" fill="#bfa100" />
            <rect x="82" y="138" width="16" height="10" rx="4" fill="#bfa100" />
          </g>
          {/* Medal */}
          <g opacity="0.15">
            <circle cx="320" cy="80" r="22" fill="#ff9800" />
            <rect x="312" y="60" width="16" height="12" rx="4" fill="#bfa100" />
          </g>
          {/* Crown */}
          <g opacity="0.13">
            <rect x="600" y="60" width="44" height="18" rx="8" fill="#ffd700" />
            <polygon points="622,60 610,78 634,78" fill="#ffc107" />
          </g>
          {/* Star */}
          <g opacity="0.12">
            <polygon points="900,60 910,90 940,90 915,110 925,140 900,120 875,140 885,110 860,90 890,90" fill="#fffde4" />
          </g>
        </svg>
        {/* Mountains - SVG layers for parallax effect */}
        <svg width="100%" height="320" style={{ position: "absolute", bottom: 0, left: 0, zIndex: 1 }}>
          <defs>
            <linearGradient id="mountain1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3a4767" />
              <stop offset="100%" stopColor="#232946" />
            </linearGradient>
            <linearGradient id="mountain2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#5f6caf" />
              <stop offset="100%" stopColor="#232946" />
            </linearGradient>
          </defs>
          <path d="M0 220 Q 120 120 320 220 T 640 220 T 960 220 T 1280 220 V 320 H 0 Z" fill="url(#mountain1)" opacity="0.8" />
          <path d="M0 260 Q 180 180 400 260 T 800 260 T 1200 260 T 1600 260 V 320 H 0 Z" fill="url(#mountain2)" opacity="0.7" />
        </svg>
        {/* Mist/Fog Layer */}
        <div style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          height: "120px",
          background: "linear-gradient(180deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.05) 100%)",
          zIndex: 2,
          filter: "blur(2px)",
        }} />
        {/* Twinkle keyframes */}
        <style>{`
          @keyframes twinkle {
            from { opacity: 0.3; }
            to { opacity: 1; }
          }
        `}</style>
      </div>
      {/* Connection Status */}
      <ConnectionStatus />

      {/* Header */}
      <header className="container" style={{ marginTop: 24, marginBottom: 24 }}>
        <div className="text-center mb-4">
          <h1
            className="mb-2"
            style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#ffd700", textShadow: "0 2px 8px #232946" }}
          >
            🏆 Dynamic Leaderboard System
          </h1>
          <p
            style={{ fontSize: "1.1rem", color: "#fff", opacity: 0.98, textShadow: "0 1px 6px #232946" }}
          >
            Select users, claim random points, and watch the rankings update in
            real-time!
          </p>
          {lastUpdate && (
            <p
              style={{ fontSize: "0.9rem", color: "#ffd700", opacity: 0.9, textShadow: "0 1px 6px #232946" }}
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
        <div className="card mt-4 stats-card-redesign" style={{
          background: "linear-gradient(135deg, #232946 0%, #181a20 100%)",
          boxShadow: "0 4px 32px #23294660",
          borderRadius: "18px",
          padding: "32px 24px",
          position: "relative",
          overflow: "hidden",
        }}>
          <h4 className="mb-4 text-center" style={{
            fontWeight: "bold",
            fontSize: "2rem",
            color: "#ffd700",
            letterSpacing: 1,
            textShadow: "0 2px 8px #232946"
          }}>📊 System Statistics</h4>
          <div className="stats-grid" style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "32px",
            alignItems: "center",
            justifyItems: "center",
            position: "relative"
          }}>
            {/* Total Users */}
            <div style={{
              background: "linear-gradient(120deg, #667eea 0%, #5f6caf 100%)",
              borderRadius: "14px",
              boxShadow: "0 2px 16px #667eea40",
              padding: "24px 12px",
              minWidth: "120px",
              textAlign: "center",
              position: "relative",
              color: "#fff"
            }}>
              <Users size={32} className="mb-2" style={{ color: "#fff", filter: "drop-shadow(0 2px 8px #667eea80)" }} />
              <div style={{ fontSize: "2.2rem", fontWeight: "bold", marginBottom: "6px", letterSpacing: 1 }}>{users.length}</div>
              <div style={{ fontSize: "1rem", opacity: 0.85 }}>Total Users</div>
              <div style={{ position: "absolute", top: 8, right: 12, opacity: 0.18, fontSize: "2.5rem" }}>👥</div>
            </div>

            {/* Total Points */}
            <div style={{
              background: "linear-gradient(120deg, #28a745 0%, #ffc107 100%)",
              borderRadius: "14px",
              boxShadow: "0 2px 16px #28a74540",
              padding: "24px 12px",
              minWidth: "120px",
              textAlign: "center",
              position: "relative",
              color: "#fff"
            }}>
              <Zap size={32} className="mb-2" style={{ color: "#fff", filter: "drop-shadow(0 2px 8px #28a74580)" }} />
              <div style={{ fontSize: "2.2rem", fontWeight: "bold", marginBottom: "6px", letterSpacing: 1 }}>{users.reduce((sum, user) => sum + user.totalPoints, 0)}</div>
              <div style={{ fontSize: "1rem", opacity: 0.85 }}>Total Points</div>
              <div style={{ position: "absolute", top: 8, right: 12, opacity: 0.18, fontSize: "2.5rem" }}>⚡</div>
            </div>

            {/* Current Leader */}
            <div style={{
              background: "linear-gradient(120deg, #ffd700 0%, #ff9800 100%)",
              borderRadius: "14px",
              boxShadow: "0 2px 16px #ffd70040",
              padding: "24px 12px",
              minWidth: "120px",
              textAlign: "center",
              position: "relative",
              color: "#232946"
            }}>
              <Trophy size={32} className="mb-2" style={{ color: "#232946", filter: "drop-shadow(0 2px 8px #ffd70080)" }} />
              <div style={{ fontSize: "2.2rem", fontWeight: "bold", marginBottom: "6px", letterSpacing: 1 }}>{users.length > 0 ? users[0]?.name || "N/A" : "N/A"}</div>
              <div style={{ fontSize: "1rem", opacity: 0.85 }}>Current Leader</div>
              <div style={{ position: "absolute", top: 8, right: 12, opacity: 0.18, fontSize: "2.5rem" }}>🏆</div>
            </div>
          </div>
          {/* Animated Glow Border */}
          <div style={{
            position: "absolute",
            inset: 0,
            borderRadius: "18px",
            pointerEvents: "none",
            boxShadow: "0 0 32px 8px #ffd70060, 0 0 64px 16px #667eea40",
            zIndex: 0,
            animation: "glow 2.5s infinite alternate"
          }} />
          <style>{`
            @keyframes glow {
              from { box-shadow: 0 0 32px 8px #ffd70060, 0 0 64px 16px #667eea40; }
              to { box-shadow: 0 0 48px 16px #ffd70090, 0 0 80px 24px #667eea80; }
            }
          `}</style>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mt-5" style={{ marginBottom: 24 }}>
        <div className="text-center" style={{ color: "#ffd700", opacity: 0.98, textShadow: "0 1px 6px #232946" }}>
          <p style={{ fontWeight: "bold" }}>Built with React.js, Node.js, MongoDB & Socket.IO</p>
          <p style={{ fontSize: "0.95rem", color: "#fff", opacity: 0.98 }}>
            Real-time leaderboard system with dynamic rankings and point history tracking
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
