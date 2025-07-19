import React, { useState } from "react";
import {
  Trophy,
  Medal,
  Award,
  Crown,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
} from "lucide-react";

/**
 * Leaderboard Component
 * Displays user rankings with pagination and real-time updates
 */
const Leaderboard = ({
  users = [],
  loading = false,
  pagination = null,
  onPageChange = null,
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Get appropriate icon for rank
  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Crown className="text-yellow-500" size={24} />;
      case 2:
        return <Trophy className="text-gray-400" size={20} />;
      case 3:
        return <Medal className="text-orange-500" size={20} />;
      default:
        return <Award className="text-blue-500" size={16} />;
    }
  };

  // Get rank styling
  const getRankStyle = (rank) => {
    switch (rank) {
      case 1:
        return {
          background: "linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)",
          color: "#8b5a00",
          fontWeight: "bold",
        };
      case 2:
        return {
          background: "linear-gradient(135deg, #c0c0c0 0%, #e5e5e5 100%)",
          color: "#4a4a4a",
          fontWeight: "bold",
        };
      case 3:
        return {
          background: "linear-gradient(135deg, #cd7f32 0%, #daa520 100%)",
          color: "#5d4e37",
          fontWeight: "bold",
        };
      default:
        return {
          background: "#f8f9fa",
          color: "#495057",
        };
    }
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    if (onPageChange) {
      onPageChange(newPage);
    }
  };

  if (loading) {
    return (
      <div className="card">
        <div className="text-center">
          <div
            className="spinner"
            style={{ width: "40px", height: "40px" }}
          ></div>
          <p className="mt-3">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card leaderboard-redesign">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h2 className="mb-0" style={{ fontWeight: "bold", letterSpacing: 1 }}>
          <Crown className="inline mr-2" size={32} />
          Leaderboard
        </h2>
        <div className="text-muted" style={{ fontSize: "18px" }}>
          {users.length} {users.length === 1 ? "user" : "users"}
        </div>
      </div>

      {users.length === 0 ? (
        <div className="text-center py-4">
          <Trophy size={64} className="text-muted mb-3" />
          <p className="text-muted" style={{ fontSize: "20px" }}>
            No users found. Add some users to get started!
          </p>
        </div>
      ) : (
        <>
          {/* Podium for Top 3 */}
          {(!pagination || pagination.currentPage === 1) && users.length >= 3 && (
            <div className="podium-container" style={{ display: "flex", justifyContent: "center", alignItems: "flex-end", gap: "32px", marginBottom: "32px" }}>
              {/* 2nd Place */}
              <div className="podium podium-2" style={{ textAlign: "center", width: "120px" }}>
                <div style={{ height: "80px", background: "linear-gradient(135deg, #c0c0c0 0%, #e5e5e5 100%)", borderRadius: "12px 12px 0 0", display: "flex", alignItems: "center", justifyContent: "center", color: "#4a4a4a", fontWeight: "bold", fontSize: "22px", boxShadow: "0 4px 16px #c0c0c0a0" }}>
                  <Trophy size={28} className="mr-2" /> 2nd
                </div>
                {users[1].image && (
                  <img src={users[1].image} alt={users[1].name} style={{ width: "64px", height: "64px", borderRadius: "50%", objectFit: "cover", margin: "12px auto", border: "3px solid #c0c0c0" }} />
                )}
                <div style={{ fontWeight: "bold", fontSize: "18px" }}>{users[1].name}</div>
                <div style={{ fontSize: "15px", color: "#666" }}>{users[1].totalPoints} pts</div>
              </div>
              {/* 1st Place */}
              <div className="podium podium-1" style={{ textAlign: "center", width: "140px" }}>
                <div style={{ height: "110px", background: "linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)", borderRadius: "12px 12px 0 0", display: "flex", alignItems: "center", justifyContent: "center", color: "#8b5a00", fontWeight: "bold", fontSize: "28px", boxShadow: "0 6px 24px #ffd700a0" }}>
                  <Crown size={36} className="mr-2" /> 1st
                </div>
                {users[0].image && (
                  <img src={users[0].image} alt={users[0].name} style={{ width: "80px", height: "80px", borderRadius: "50%", objectFit: "cover", margin: "16px auto", border: "4px solid #ffd700" }} />
                )}
                <div style={{ fontWeight: "bold", fontSize: "22px" }}>{users[0].name}</div>
                <div style={{ fontSize: "17px", color: "#666" }}>{users[0].totalPoints} pts</div>
              </div>
              {/* 3rd Place */}
              <div className="podium podium-3" style={{ textAlign: "center", width: "120px" }}>
                <div style={{ height: "60px", background: "linear-gradient(135deg, #cd7f32 0%, #daa520 100%)", borderRadius: "12px 12px 0 0", display: "flex", alignItems: "center", justifyContent: "center", color: "#5d4e37", fontWeight: "bold", fontSize: "20px", boxShadow: "0 4px 16px #cd7f32a0" }}>
                  <Medal size={24} className="mr-2" /> 3rd
                </div>
                {users[2].image && (
                  <img src={users[2].image} alt={users[2].name} style={{ width: "56px", height: "56px", borderRadius: "50%", objectFit: "cover", margin: "10px auto", border: "3px solid #cd7f32" }} />
                )}
                <div style={{ fontWeight: "bold", fontSize: "16px" }}>{users[2].name}</div>
                <div style={{ fontSize: "14px", color: "#666" }}>{users[2].totalPoints} pts</div>
              </div>
            </div>
          )}

          {/* Leaderboard List with animation and avatars */}
          <div className="leaderboard-list" style={{ display: "flex", flexDirection: "column", overflowY: "auto", gap: "16px", maxHeight: "340px", minWidth: "260px", width: "100%", paddingRight: "8px" }}>
            {users.map((user, index) => (
              <div
                key={user._id}
                className="leaderboard-item slide-in"
                style={{
                  ...getRankStyle(user.rank),
                  minHeight: "72px",
                  marginBottom: 0,
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  boxShadow: user.rank <= 3 ? "0 2px 12px #ffd70040" : "0 1px 6px #ccc",
                  transition: "all 0.3s cubic-bezier(.4,2,.3,1)",
                  animationDelay: `${index * 0.08}s`,
                }}
              >
                <div className="d-flex align-items-center gap-3">
                  {/* Rank Icon */}
                  <div className="rank-icon">{getRankIcon(user.rank)}</div>
                  {/* User Avatar */}
                  {user.image && (
                    <img src={user.image} alt={user.name} style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover", marginRight: "12px", border: "2px solid #ddd" }} />
                  )}
                  {/* User Info */}
                  <div>
                    <h4 className="mb-1" style={{ fontSize: "18px" }}>
                      {user.name}
                    </h4>
                    <p className="mb-0 text-muted" style={{ fontSize: "14px" }}>
                      Rank #{user.rank}
                    </p>
                  </div>
                </div>
                {/* Points Display */}
                <div className="text-right">
                  <div style={{ fontSize: "24px", fontWeight: "bold" }}>
                    {user.totalPoints}
                  </div>
                  <div style={{ fontSize: "12px", opacity: 0.7 }}>points</div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="d-flex align-items-center justify-content-between mt-4">
              <button
                className="btn btn-secondary"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={!pagination.hasPrevPage}
              >
                <ChevronLeft size={16} />
                Previous
              </button>
              <div className="d-flex align-items-center gap-2">
                <span className="text-muted">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </span>
                <span className="text-muted">
                  ({pagination.totalUsers} total users)
                </span>
              </div>
              <button
                className="btn btn-secondary"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={!pagination.hasNextPage}
              >
                Next
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Leaderboard;
