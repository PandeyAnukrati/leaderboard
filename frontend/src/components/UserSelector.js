import React, { useState } from "react";
import { User, Plus } from "lucide-react";

/**
 * UserSelector Component
 * Allows users to select from existing users or add new ones
 */
const UserSelector = ({
  users,
  selectedUser,
  onUserSelect,
  onAddUser,
  loading = false,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUserName, setNewUserName] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [claimPoints, setClaimPoints] = useState(0);
  const [isClaiming, setIsClaiming] = useState(false);
  const [claimSuccess, setClaimSuccess] = useState(false);

  // Handler for claiming points (calls prop if provided)
  const handleClaimPoints = async (e) => {
    e.preventDefault();
    if (!selectedUser || claimPoints <= 0) return;
    setIsClaiming(true);
    setClaimSuccess(false);
    try {
      if (typeof onUserSelect === "function" && typeof selectedUser._id !== "undefined") {
        // You may want to call a dedicated onClaimPoints prop instead
        await onUserSelect({ ...selectedUser, claimPoints });
      }
      setClaimSuccess(true);
      setClaimPoints(0);
      setTimeout(() => setClaimSuccess(false), 1800);
    } catch (err) {
      setClaimSuccess(false);
    } finally {
      setIsClaiming(false);
    }
  };

  // Handle form submission for adding new user
  const handleAddUser = async (e) => {
    e.preventDefault();

    if (!newUserName.trim()) {
      return;
    }

    setIsAdding(true);

    try {
      await onAddUser(newUserName.trim());
      setNewUserName("");
      setShowAddForm(false);
    } catch (error) {
      console.error("Error adding user:", error);
    } finally {
      setIsAdding(false);
    }
  };

  // Cancel adding user
  const handleCancelAdd = () => {
    setNewUserName("");
    setShowAddForm(false);
  };

  return (
    <div className="user-selector-modern" style={{ maxWidth: 480, margin: "0 auto", background: "#fff", borderRadius: 24, boxShadow: "0 4px 24px #e3f2fd80", padding: "32px 28px", minHeight: 420, display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <h2 style={{ fontWeight: "bold", fontSize: 28, letterSpacing: 1, color: "#1976d2", display: "flex", alignItems: "center" }}>
          <User size={32} style={{ marginRight: 10 }} /> Select User
        </h2>
        {!showAddForm && (
          <button
            className="btn btn-primary"
            style={{ fontWeight: "bold", fontSize: 16, borderRadius: 12, padding: "8px 18px", boxShadow: "0 2px 8px #bbdefb80" }}
            onClick={() => setShowAddForm(true)}
            disabled={loading}
          >
            <Plus size={18} style={{ marginRight: 6 }} /> Add User
          </button>
        )}
      </div>

      {/* Add User Form */}
      {showAddForm && (
        <form onSubmit={handleAddUser} style={{
          background: "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)",
          borderRadius: 16,
          boxShadow: "0 2px 12px #bbdefb80",
          padding: "24px 24px",
          marginBottom: 18,
          textAlign: "center",
          maxWidth: 340,
          width: "100%",
          overflowX: "auto"
        }}>
          <h3 style={{ color: "#1976d2", fontWeight: "bold", marginBottom: 12 }}>Add New User</h3>
          <input
            type="text"
            value={newUserName}
            onChange={e => setNewUserName(e.target.value)}
            placeholder="Enter user name"
            style={{
              padding: "10px 16px",
              borderRadius: 8,
              border: "1px solid #90caf9",
              fontSize: 16,
              width: "80%",
              marginBottom: 16,
              outline: "none"
            }}
            disabled={isAdding}
            autoFocus
          />
          <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ fontWeight: "bold", fontSize: 16, borderRadius: 8, padding: "8px 18px" }}
              disabled={isAdding || !newUserName.trim()}
            >
              {isAdding ? "Adding..." : "Add"}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              style={{ fontWeight: "bold", fontSize: 16, borderRadius: 8, padding: "8px 18px" }}
              onClick={handleCancelAdd}
              disabled={isAdding}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* User Selection Cards */}
      {!showAddForm && (
        <div style={{ width: "100%", marginBottom: 18, overflowX: "auto", paddingBottom: 6 }}>
          <div style={{ display: "flex", gap: "18px", minWidth: 340 }}>
            {users.map((user) => (
              <div
                key={user._id}
                className={`user-card${selectedUser?._id === user._id ? " selected" : ""}`}
                style={{
                  background: selectedUser?._id === user._id ? "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)" : "#f8f9fa",
                  border: selectedUser?._id === user._id ? "2px solid #1976d2" : "2px solid #eee",
                  borderRadius: 16,
                  boxShadow: selectedUser?._id === user._id ? "0 2px 12px #bbdefb80" : "0 1px 6px #ccc",
                  padding: "18px 16px",
                  minWidth: 120,
                  maxWidth: 140,
                  textAlign: "center",
                  cursor: loading ? "not-allowed" : "pointer",
                  transition: "all 0.2s cubic-bezier(.4,2,.3,1)",
                  position: "relative"
                }}
                onClick={() => !loading && onUserSelect(user)}
              >
                {user.image ? (
                  <img src={user.image} alt={user.name} style={{ width: 48, height: 48, borderRadius: "50%", objectFit: "cover", marginBottom: 8, border: "2px solid #1976d2" }} />
                ) : (
                  <User size={40} style={{ color: "#90caf9", marginBottom: 8 }} />
                )}
                <div style={{ fontWeight: "bold", fontSize: 18, color: "#1976d2" }}>{user.name}</div>
                <div style={{ fontSize: 14, color: "#666", marginBottom: 4 }}>{user.totalPoints} pts</div>
                <div style={{ fontSize: 13, color: "#888" }}>Rank #{user.rank}</div>
                {selectedUser?._id === user._id && (
                  <div style={{ position: "absolute", top: 8, right: 8, background: "#1976d2", color: "#fff", borderRadius: "50%", width: 18, height: 18, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: "bold" }}>✓</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Selected User Info - Modern Card */}
      {selectedUser && !showAddForm && (
        <div style={{ background: "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)", borderRadius: 16, boxShadow: "0 2px 12px #bbdefb80", padding: "18px 24px", marginTop: 18, textAlign: "center" }}>
          {selectedUser.image ? (
            <img src={selectedUser.image} alt={selectedUser.name} style={{ width: 56, height: 56, borderRadius: "50%", objectFit: "cover", marginBottom: 10, border: "2px solid #1976d2" }} />
          ) : (
            <User size={44} style={{ color: "#1976d2", marginBottom: 10 }} />
          )}
          <h3 style={{ color: "#1976d2", fontWeight: "bold", marginBottom: 6 }}>{selectedUser.name}</h3>
          <div style={{ fontSize: 16, color: "#388e3c", fontWeight: "bold", marginBottom: 2 }}>{selectedUser.totalPoints} pts</div>
          <div style={{ fontSize: 15, color: "#888" }}>Rank #{selectedUser.rank}</div>
        </div>
      )}
    </div>
  );
};

export default UserSelector;
