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

  // Handle claim button click
  const handleClaim = async () => {
    if (!selectedUser || loading || disabled) {
      return;
    }

    setIsAnimating(true);
    setLastClaimResult(null);

    try {
      const result = await onClaimPoints(selectedUser._id);
      setLastClaimResult(result);

      // Reset animation after a delay
      setTimeout(() => {
        setIsAnimating(false);
      }, 1000);
    } catch (error) {
      console.error("Error claiming points:", error);
      setIsAnimating(false);
    }
  };

  // Reset last claim result when user changes
  React.useEffect(() => {
    setLastClaimResult(null);
  }, [selectedUser]);

  const isDisabled = !selectedUser || loading || disabled;

  return (
    <div className="card">
      <div className="text-center">
        <h3 className="mb-3">
          <Gift className="inline mr-2" size={24} />
          Claim Points
        </h3>

        {/* Claim Button */}
        <button
          className={`btn btn-primary ${isAnimating ? "animate-pulse" : ""}`}
          onClick={handleClaim}
          disabled={isDisabled}
          style={{
            fontSize: "18px",
            padding: "16px 32px",
            minWidth: "200px",
            transform: isAnimating ? "scale(1.05)" : "scale(1)",
            transition: "all 0.3s ease",
          }}
        >
          {loading ? (
            <>
              <div className="spinner"></div>
              Claiming...
            </>
          ) : (
            <>
              <Zap size={20} />
              Claim Random Points
            </>
          )}
        </button>

        {/* Instructions */}
        <div className="mt-3">
          {!selectedUser ? (
            <p className="text-muted">Please select a user to claim points</p>
          ) : (
            <p className="text-muted">
              Click to award random points (1-10) to{" "}
              <strong>{selectedUser.name}</strong>
            </p>
          )}
        </div>

        {/* Last Claim Result */}
        {lastClaimResult && (
          <div
            className="mt-4 p-3 fade-in"
            style={{
              backgroundColor: "#d4edda",
              borderRadius: "8px",
              border: "1px solid #c3e6cb",
            }}
          >
            <h4 className="text-success mb-2">🎉 Points Claimed!</h4>
            <div className="d-flex justify-content-center gap-3">
              <div className="text-center">
                <div
                  className="text-success"
                  style={{ fontSize: "24px", fontWeight: "bold" }}
                >
                  +{lastClaimResult.data.pointsAwarded}
                </div>
                <small className="text-muted">Points Awarded</small>
              </div>
              <div className="text-center">
                <div style={{ fontSize: "18px", fontWeight: "bold" }}>
                  {lastClaimResult.data.newTotal}
                </div>
                <small className="text-muted">Total Points</small>
              </div>
              <div className="text-center">
                <div style={{ fontSize: "18px", fontWeight: "bold" }}>
                  #{lastClaimResult.data.user.rank}
                </div>
                <small className="text-muted">New Rank</small>
              </div>
            </div>
          </div>
        )}

        {/* Point Range Info */}
        <div
          className="mt-4 p-3"
          style={{ backgroundColor: "#f8f9fa", borderRadius: "8px" }}
        >
          <h5 className="mb-2">How it works:</h5>
          <ul
            style={{ textAlign: "left", margin: "0 auto", maxWidth: "300px" }}
          >
            <li>Each claim awards 1-10 random points</li>
            <li>Points are added to user's total</li>
            <li>Rankings update automatically</li>
            <li>All claims are tracked in history</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ClaimButton;
