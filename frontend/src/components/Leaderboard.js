import React, { useState } from "react";
import {
  Trophy,
  Medal,
  Award,
  Crown,
  ChevronLeft,
  ChevronRight,
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
    <div className="card">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h3 className="mb-0">
          <Trophy className="inline mr-2" size={24} />
          Leaderboard
        </h3>
        <div className="text-muted">
          {users.length} {users.length === 1 ? "user" : "users"}
        </div>
      </div>

      {users.length === 0 ? (
        <div className="text-center py-4">
          <Trophy size={48} className="text-muted mb-3" />
          <p className="text-muted">
            No users found. Add some users to get started!
          </p>
        </div>
      ) : (
        <>
          {/* Leaderboard List */}
          <div className="leaderboard-list">
            {users.map((user, index) => (
              <div
                key={user._id}
                className="leaderboard-item slide-in"
                style={{
                  ...getRankStyle(user.rank),
                  padding: "16px",
                  marginBottom: "12px",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  transition: "all 0.3s ease",
                  animationDelay: `${index * 0.1}s`,
                }}
              >
                <div className="d-flex align-items-center gap-3">
                  {/* Rank Icon */}
                  <div className="rank-icon">{getRankIcon(user.rank)}</div>

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

          {/* Top 3 Podium (for first page only) */}
          {(!pagination || pagination.currentPage === 1) &&
            users.length >= 3 && (
              <div
                className="mt-4 p-4"
                style={{ backgroundColor: "#f8f9fa", borderRadius: "12px" }}
              >
                <h4 className="text-center mb-3">🏆 Top 3 Champions 🏆</h4>
                <div className="d-flex justify-content-center align-items-end gap-3">
                  {/* 2nd Place */}
                  {users[1] && (
                    <div className="text-center">
                      <div
                        style={{
                          height: "80px",
                          background:
                            "linear-gradient(135deg, #c0c0c0 0%, #e5e5e5 100%)",
                          borderRadius: "8px 8px 0 0",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#4a4a4a",
                          fontWeight: "bold",
                        }}
                      >
                        2nd
                      </div>
                      <div className="mt-2">
                        <div style={{ fontSize: "14px", fontWeight: "bold" }}>
                          {users[1].name}
                        </div>
                        <div style={{ fontSize: "12px", color: "#666" }}>
                          {users[1].totalPoints} pts
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 1st Place */}
                  {users[0] && (
                    <div className="text-center">
                      <div
                        style={{
                          height: "100px",
                          background:
                            "linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)",
                          borderRadius: "8px 8px 0 0",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#8b5a00",
                          fontWeight: "bold",
                        }}
                      >
                        1st
                      </div>
                      <div className="mt-2">
                        <div style={{ fontSize: "16px", fontWeight: "bold" }}>
                          {users[0].name}
                        </div>
                        <div style={{ fontSize: "14px", color: "#666" }}>
                          {users[0].totalPoints} pts
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 3rd Place */}
                  {users[2] && (
                    <div className="text-center">
                      <div
                        style={{
                          height: "60px",
                          background:
                            "linear-gradient(135deg, #cd7f32 0%, #daa520 100%)",
                          borderRadius: "8px 8px 0 0",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#5d4e37",
                          fontWeight: "bold",
                        }}
                      >
                        3rd
                      </div>
                      <div className="mt-2">
                        <div style={{ fontSize: "14px", fontWeight: "bold" }}>
                          {users[2].name}
                        </div>
                        <div style={{ fontSize: "12px", color: "#666" }}>
                          {users[2].totalPoints} pts
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
        </>
      )}
    </div>
  );
};

export default Leaderboard;
