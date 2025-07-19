import React, { useState } from "react";
import { Gift, Zap } from "lucide-react";

/**
 * ClaimButton Component
 * Handles point claiming functionality with visual feedback
 */
const ClaimButton = ({
  selectedUser,
  onClaimPoints,
  loading = false,
  
  disabled = false,
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [lastClaimResult, setLastClaimResult] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);

  // Handle claim button click
  const handleClaim = async () => {
    if (!selectedUser || loading || disabled) {
      return;
    }

    setIsAnimating(true);
    setLastClaimResult(null);
    setShowConfetti(false);
    try {
      const result = await onClaimPoints(selectedUser._id);
      setLastClaimResult(result);
      setShowConfetti(true);
      setTimeout(() => {
        setIsAnimating(false);
        setShowConfetti(false);
      }, 1200);
    } catch (error) {
      console.error("Error claiming points:", error);
      setIsAnimating(false);
      setShowConfetti(false);
    }
  };

  // Reset last claim result when user changes
  React.useEffect(() => {
    setLastClaimResult(null);
  }, [selectedUser]);

  const isDisabled = !selectedUser || loading || disabled;

  return (
    <div className="card" style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.08)", borderRadius: 20, padding: 32, background: "linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)", position: "relative" }}>
      <div className="text-center">
        <h3 className="mb-4" style={{ fontWeight: 700, fontSize: 24, letterSpacing: 1 }}>
          <Gift className="inline mr-2" size={28} color="#7c3aed" />
          Claim Points
        </h3>

        {/* Confetti burst animation */}
        {showConfetti && (
          <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 0, pointerEvents: "none" }}>
            <svg width="100%" height="60" style={{ display: "block" }}>
              <circle cx="20" cy="20" r="6" fill="#fbbf24" />
              <circle cx="60" cy="10" r="4" fill="#34d399" />
              <circle cx="120" cy="30" r="5" fill="#f472b6" />
              <circle cx="180" cy="15" r="3" fill="#60a5fa" />
              <circle cx="240" cy="25" r="4" fill="#a3e635" />
            </svg>
          </div>
        )}

        {/* Claim Button */}
        <button
          className={`btn btn-primary ${isAnimating ? "animate-pulse" : ""}`}
          onClick={handleClaim}
          disabled={isDisabled}
          style={{
            fontSize: "20px",
            padding: "18px 40px",
            minWidth: "220px",
            borderRadius: "999px",
            background: isDisabled ? "#e5e7eb" : "linear-gradient(90deg,#7c3aed 0%,#6366f1 100%)",
            color: isDisabled ? "#9ca3af" : "#fff",
            boxShadow: isAnimating ? "0 0 0 4px #c7d2fe" : "0 2px 8px rgba(124,58,237,0.12)",
            border: "none",
            position: "relative",
            transition: "all 0.3s cubic-bezier(.4,2,.3,1)",
            outline: "none",
          }}
        >
          {loading ? (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
              <span className="loader" style={{
                width: 22,
                height: 22,
                border: "3px solid #fff",
                borderTop: "3px solid #7c3aed",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
                marginRight: 8,
                display: "inline-block"
              }}></span>
              Claiming...
            </span>
          ) : (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
              <Zap size={22} color="#fbbf24" />
              <span style={{ fontWeight: 600 }}>Claim Random Points</span>
            </span>
          )}
        </button>

        {/* Instructions */}
        <div className="mt-3">
          {!selectedUser ? (
            <div style={{
              background: "linear-gradient(90deg,#f3f4f6 0%,#e0e7ff 100%)",
              borderRadius: "10px",
              padding: "18px 0",
              margin: "0 auto",
              maxWidth: 320,
              color: "#6366f1",
              fontWeight: 600,
              fontSize: 18,
              boxShadow: "0 2px 8px rgba(124,58,237,0.06)",
              border: "1px solid #e0e7ff"
            }}>
              <span role="img" aria-label="user">👤</span> Please select a user to claim points
            </div>
          ) : (
            <p className="text-muted" style={{ fontSize: 16 }}>
              Click to award random points (1-10) to <strong>{selectedUser.name}</strong>
            </p>
          )}
        </div>

        {/* Last Claim Result */}
        {lastClaimResult && (
          <div
            className="mt-4 fade-in"
            style={{
              background: "linear-gradient(90deg,#bbf7d0 0%,#f0fdf4 100%)",
              borderRadius: "16px",
              border: "1px solid #a7f3d0",
              boxShadow: "0 2px 12px rgba(16,185,129,0.08)",
              padding: "24px 16px",
              margin: "0 auto",
              maxWidth: 340,
              position: "relative"
            }}
          >
            <h4 className="text-success mb-3" style={{ fontWeight: 700, fontSize: 22 }}>🎉 Points Claimed!</h4>
            <div className="d-flex justify-content-center gap-4" style={{ display: "flex", justifyContent: "center", gap: 32 }}>
              <div className="text-center">
                <div style={{ fontSize: "32px", fontWeight: "bold", color: "#059669" }}>
                  +{lastClaimResult.data.pointsAwarded}
                </div>
                <small className="text-muted">Points Awarded</small>
              </div>
              <div className="text-center">
                <div style={{ fontSize: "22px", fontWeight: "bold", color: "#6366f1" }}>
                  {lastClaimResult.data.newTotal}
                </div>
                <small className="text-muted">Total Points</small>
              </div>
              <div className="text-center">
                <div style={{ fontSize: "22px", fontWeight: "bold", color: "#fbbf24" }}>
                  #{lastClaimResult.data.user.rank}
                </div>
                <small className="text-muted">New Rank</small>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Point Range Info - now outside the centered inner div, full width */}
      <div
        className="mt-4 p-3"
        style={{ background: "linear-gradient(90deg,#e0e7ff 0%,#f8fafc 100%)", borderRadius: "12px", marginTop: 32, width: "100%", boxSizing: "border-box" }}
      >
        <h5 className="mb-2" style={{ fontWeight: 600 }}>How it works:</h5>
        <ul style={{ textAlign: "left", margin: 0, width: "100%", fontSize: 15 }}>
          <li>Each claim awards <span style={{ color: "#7c3aed", fontWeight: 600 }}>1-10</span> random points</li>
          <li>Points are added to user's total</li>
          <li>Rankings update automatically</li>
          <li>All claims are tracked in history</li>
        </ul>
      </div>
      {/* Loader keyframes */}
      <style>{`
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default ClaimButton;
