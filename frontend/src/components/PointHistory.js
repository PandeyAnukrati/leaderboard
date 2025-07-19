import React, { useState, useEffect } from "react";
import {
  History,
  Clock,
  User,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  Award,
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
    <div className="card point-history-redesign">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h2 className="mb-0" style={{ fontWeight: "bold", letterSpacing: 1 }}>
          <History className="inline mr-2" size={32} />
          Point History
        </h2>
        <div className="text-muted" style={{ fontSize: "18px" }}>
          {pagination?.totalHistory || 0} total claims
        </div>
      </div>

      {history.length === 0 ? (
        <div className="text-center py-4">
          <History size={64} className="text-muted mb-3" />
          <p className="text-muted" style={{ fontSize: "20px" }}>
            No point claims yet. Start claiming points to see history!
          </p>
        </div>
      ) : (
        <>
          {/* Timeline History List */}
          <div className="history-timeline">
            {history.map((claim, index) => {
              const { date, time } = formatDate(claim.claimedAt);
              return (
                <div
                  key={claim._id}
                  className="timeline-item fade-in"
                  style={{
                    position: "relative",
                    padding: "24px 16px 24px 48px",
                    marginBottom: "18px",
                    backgroundColor: "#f8f9fa",
                    borderRadius: "16px",
                    border: "1px solid #e9ecef",
                    boxShadow: "0 2px 12px #e3f2fd80",
                    transition: "all 0.3s cubic-bezier(.4,2,.3,1)",
                    animationDelay: `${index * 0.07}s`,
                  }}
                >
                  {/* Timeline Dot */}
                  <span style={{
                    position: "absolute",
                    left: "24px",
                    top: "32px",
                    width: "12px",
                    height: "12px",
                    background: getPointsColor(claim.pointsAwarded),
                    borderRadius: "50%",
                    boxShadow: "0 0 8px #1976d2a0",
                    border: "2px solid #fff"
                  }}></span>
                  <div className="d-flex align-items-center justify-content-between">
                    {/* User and Points Info */}
                    <div className="d-flex align-items-center gap-3">
                      {/* Animated Points Badge */}
                      <div
                        className="points-badge pulse"
                        style={{
                          backgroundColor: getPointsColor(claim.pointsAwarded),
                          color: "white",
                          borderRadius: "50%",
                          width: "48px",
                          height: "48px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: "bold",
                          fontSize: "16px",
                          boxShadow: "0 2px 8px #1976d2a0",
                          marginRight: "8px"
                        }}
                      >
                        +{claim.pointsAwarded}
                      </div>
                      {/* User Avatar (if available) */}
                      {claim.userImage && (
                        <img src={claim.userImage} alt={claim.userName} style={{ width: "36px", height: "36px", borderRadius: "50%", objectFit: "cover", marginRight: "8px", border: "2px solid #1976d2" }} />
                      )}
                      <div>
                        <div className="d-flex align-items-center gap-2 mb-1">
                          <User size={16} className="text-muted" />
                          <span style={{ fontWeight: "600", fontSize: "17px" }}>
                            {claim.userName}
                          </span>
                        </div>
                        <div
                          className="d-flex align-items-center gap-2 text-muted"
                          style={{ fontSize: "15px" }}
                        >
                          <TrendingUp size={15} />
                          <span>
                            {claim.previousTotal} → {claim.newTotal} points
                          </span>
                        </div>
                      </div>
                    </div>
                    {/* Date and Time */}
                    <div className="text-right">
                      <div className="d-flex align-items-center gap-2 mb-1">
                        <Clock size={15} className="text-muted" />
                        <span style={{ fontSize: "15px", fontWeight: "500" }}>
                          {time}
                        </span>
                      </div>
                      <div className="text-muted" style={{ fontSize: "13px" }}>
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

          {/* Visually Appealing Quick Stats */}
          <div className="quick-stats" style={{ marginBottom: "32px", marginTop: "16px" }}>
            <div style={{ display: "flex", justifyContent: "center", gap: "32px" }}>
              <div style={{ background: "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)", borderRadius: "16px", boxShadow: "0 2px 12px #bbdefb80", padding: "18px 28px", textAlign: "center", minWidth: "120px" }}>
                <History size={28} style={{ color: "#1976d2", marginBottom: "6px" }} />
                <div style={{ fontWeight: "bold", fontSize: "22px", color: "#1976d2" }}>{pagination?.totalHistory || 0}</div>
                <div style={{ fontSize: "13px", color: "#1976d2" }}>Total Claims</div>
              </div>
              <div style={{ background: "linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)", borderRadius: "16px", boxShadow: "0 2px 12px #c8e6c980", padding: "18px 28px", textAlign: "center", minWidth: "120px" }}>
                <Award size={28} style={{ color: "#388e3c", marginBottom: "6px" }} />
                <div style={{ fontWeight: "bold", fontSize: "22px", color: "#388e3c" }}>{history.reduce((sum, claim) => sum + claim.pointsAwarded, 0)}</div>
                <div style={{ fontSize: "13px", color: "#388e3c" }}>Points This Page</div>
              </div>
              <div style={{ background: "linear-gradient(135deg, #fffde7 0%, #fff9c4 100%)", borderRadius: "16px", boxShadow: "0 2px 12px #fffde780", padding: "18px 28px", textAlign: "center", minWidth: "120px" }}>
                <TrendingUp size={28} style={{ color: "#fbc02d", marginBottom: "6px" }} />
                <div style={{ fontWeight: "bold", fontSize: "22px", color: "#fbc02d" }}>{history.length > 0 ? Math.round(history.reduce((sum, claim) => sum + claim.pointsAwarded, 0) / history.length) : 0}</div>
                <div style={{ fontSize: "13px", color: "#fbc02d" }}>Avg Points</div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PointHistory;
