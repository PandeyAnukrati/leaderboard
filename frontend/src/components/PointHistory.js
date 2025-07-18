import React, { useState, useEffect } from "react";
import {
  History,
  Clock,
  User,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { userService } from "../services/api";

/**
 * PointHistory Component
 * Displays the history of all point claims with pagination
 */
const PointHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch point history
  const fetchHistory = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);

      const response = await userService.getPointHistory(null, page, 10);

      setHistory(response.data);
      setPagination(response.pagination);
      setCurrentPage(page);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching point history:", err);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchHistory(1);
  }, []);

  // Handle page change
  const handlePageChange = (newPage) => {
    fetchHistory(newPage);
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
  };

  // Get points color based on value
  const getPointsColor = (points) => {
    if (points >= 8) return "#28a745"; // Green for high points
    if (points >= 5) return "#ffc107"; // Yellow for medium points
    return "#6c757d"; // Gray for low points
  };

  if (loading && history.length === 0) {
    return (
      <div className="card">
        <div className="text-center">
          <div
            className="spinner"
            style={{ width: "40px", height: "40px" }}
          ></div>
          <p className="mt-3">Loading point history...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <div className="text-center">
          <p className="text-danger">Error loading history: {error}</p>
          <button
            className="btn btn-primary mt-2"
            onClick={() => fetchHistory(currentPage)}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h3 className="mb-0">
          <History className="inline mr-2" size={24} />
          Point History
        </h3>
        <div className="text-muted">
          {pagination?.totalHistory || 0} total claims
        </div>
      </div>

      {history.length === 0 ? (
        <div className="text-center py-4">
          <History size={48} className="text-muted mb-3" />
          <p className="text-muted">
            No point claims yet. Start claiming points to see history!
          </p>
        </div>
      ) : (
        <>
          {/* History List */}
          <div className="history-list">
            {history.map((claim, index) => {
              const { date, time } = formatDate(claim.claimedAt);

              return (
                <div
                  key={claim._id}
                  className="history-item fade-in"
                  style={{
                    padding: "16px",
                    marginBottom: "12px",
                    backgroundColor: "#f8f9fa",
                    borderRadius: "12px",
                    border: "1px solid #e9ecef",
                    transition: "all 0.2s ease",
                    animationDelay: `${index * 0.05}s`,
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = "#e9ecef";
                    e.target.style.transform = "translateY(-1px)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "#f8f9fa";
                    e.target.style.transform = "translateY(0)";
                  }}
                >
                  <div className="d-flex align-items-center justify-content-between">
                    {/* User and Points Info */}
                    <div className="d-flex align-items-center gap-3">
                      <div
                        className="points-badge"
                        style={{
                          backgroundColor: getPointsColor(claim.pointsAwarded),
                          color: "white",
                          borderRadius: "50%",
                          width: "40px",
                          height: "40px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: "bold",
                          fontSize: "14px",
                        }}
                      >
                        +{claim.pointsAwarded}
                      </div>

                      <div>
                        <div className="d-flex align-items-center gap-2 mb-1">
                          <User size={16} className="text-muted" />
                          <span style={{ fontWeight: "600", fontSize: "16px" }}>
                            {claim.userName}
                          </span>
                        </div>
                        <div
                          className="d-flex align-items-center gap-2 text-muted"
                          style={{ fontSize: "14px" }}
                        >
                          <TrendingUp size={14} />
                          <span>
                            {claim.previousTotal} → {claim.newTotal} points
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Date and Time */}
                    <div className="text-right">
                      <div className="d-flex align-items-center gap-2 mb-1">
                        <Clock size={14} className="text-muted" />
                        <span style={{ fontSize: "14px", fontWeight: "500" }}>
                          {time}
                        </span>
                      </div>
                      <div className="text-muted" style={{ fontSize: "12px" }}>
                        {date}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="d-flex align-items-center justify-content-between mt-4">
              <button
                className="btn btn-secondary"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={!pagination.hasPrevPage || loading}
              >
                <ChevronLeft size={16} />
                Previous
              </button>

              <div className="d-flex align-items-center gap-2">
                <span className="text-muted">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </span>
              </div>

              <button
                className="btn btn-secondary"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={!pagination.hasNextPage || loading}
              >
                Next
                <ChevronRight size={16} />
              </button>
            </div>
          )}

          {/* Summary Stats */}
          <div
            className="mt-4 p-3"
            style={{ backgroundColor: "#e3f2fd", borderRadius: "8px" }}
          >
            <h5 className="mb-2">📊 Quick Stats</h5>
            <div className="d-flex justify-content-around text-center">
              <div>
                <div
                  style={{
                    fontSize: "20px",
                    fontWeight: "bold",
                    color: "#1976d2",
                  }}
                >
                  {pagination?.totalHistory || 0}
                </div>
                <div style={{ fontSize: "12px", color: "#666" }}>
                  Total Claims
                </div>
              </div>
              <div>
                <div
                  style={{
                    fontSize: "20px",
                    fontWeight: "bold",
                    color: "#388e3c",
                  }}
                >
                  {history.reduce((sum, claim) => sum + claim.pointsAwarded, 0)}
                </div>
                <div style={{ fontSize: "12px", color: "#666" }}>
                  Points This Page
                </div>
              </div>
              <div>
                <div
                  style={{
                    fontSize: "20px",
                    fontWeight: "bold",
                    color: "#f57c00",
                  }}
                >
                  {history.length > 0
                    ? Math.round(
                        history.reduce(
                          (sum, claim) => sum + claim.pointsAwarded,
                          0
                        ) / history.length
                      )
                    : 0}
                </div>
                <div style={{ fontSize: "12px", color: "#666" }}>
                  Avg Points
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PointHistory;
