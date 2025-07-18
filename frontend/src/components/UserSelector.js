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
    <div className="card">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h3 className="mb-0">
          <User className="inline mr-2" size={24} />
          Select User
        </h3>
        {!showAddForm && (
          <button
            className="btn btn-secondary"
            onClick={() => setShowAddForm(true)}
            disabled={loading}
          >
            <Plus size={16} />
            Add User
          </button>
        )}
      </div>

      {/* User Selection Dropdown */}
      <div className="form-group">
        <label className="form-label">Choose a user to claim points:</label>
        <select
          className="form-control form-select"
          value={selectedUser?._id || ""}
          onChange={(e) => {
            const user = users.find((u) => u._id === e.target.value);
            onUserSelect(user);
          }}
          disabled={loading || showAddForm}
        >
          <option value="">-- Select a user --</option>
          {users.map((user) => (
            <option key={user._id} value={user._id}>
              {user.name} ({user.totalPoints} points)
            </option>
          ))}
        </select>
      </div>

      {/* Add New User Form */}
      {showAddForm && (
        <div
          className="card"
          style={{ backgroundColor: "#f8f9fa", marginTop: "16px" }}
        >
          <h4 className="mb-3">Add New User</h4>
          <form onSubmit={handleAddUser}>
            <div className="form-group">
              <label className="form-label">User Name:</label>
              <input
                type="text"
                className="form-control"
                value={newUserName}
                onChange={(e) => setNewUserName(e.target.value)}
                placeholder="Enter user name"
                disabled={isAdding}
                minLength={2}
                maxLength={50}
                required
              />
            </div>
            <div className="d-flex gap-2">
              <button
                type="submit"
                className="btn btn-success"
                disabled={isAdding || !newUserName.trim()}
              >
                {isAdding ? (
                  <>
                    <div className="spinner"></div>
                    Adding...
                  </>
                ) : (
                  <>
                    <Plus size={16} />
                    Add User
                  </>
                )}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleCancelAdd}
                disabled={isAdding}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Selected User Info */}
      {selectedUser && !showAddForm && (
        <div
          className="mt-3 p-3"
          style={{ backgroundColor: "#e3f2fd", borderRadius: "8px" }}
        >
          <h4 className="text-primary mb-1">Selected User</h4>
          <p className="mb-1">
            <strong>Name:</strong> {selectedUser.name}
          </p>
          <p className="mb-1">
            <strong>Current Points:</strong> {selectedUser.totalPoints}
          </p>
          <p className="mb-0">
            <strong>Current Rank:</strong> #{selectedUser.rank}
          </p>
        </div>
      )}
    </div>
  );
};

export default UserSelector;
