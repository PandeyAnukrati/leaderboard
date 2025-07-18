import React, { useState, useEffect } from "react";
import { Wifi, WifiOff, RefreshCw } from "lucide-react";
import socketService from "../services/socket";

/**
 * ConnectionStatus Component
 * Shows real-time connection status and allows manual reconnection
 */
const ConnectionStatus = () => {
  const [connectionStatus, setConnectionStatus] = useState({
    isConnected: false,
    socketId: null,
  });
  const [isReconnecting, setIsReconnecting] = useState(false);

  // Update connection status
  const updateConnectionStatus = () => {
    const status = socketService.getConnectionStatus();
    setConnectionStatus(status);
  };

  // Handle manual reconnection
  const handleReconnect = async () => {
    setIsReconnecting(true);

    try {
      socketService.disconnect();
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 second
      socketService.connect();
    } catch (error) {
      console.error("Manual reconnection failed:", error);
    } finally {
      setTimeout(() => {
        setIsReconnecting(false);
        updateConnectionStatus();
      }, 2000);
    }
  };

  useEffect(() => {
    // Initial status check
    updateConnectionStatus();

    // Set up interval to check connection status
    const interval = setInterval(updateConnectionStatus, 2000);

    // Listen for socket events
    const socket = socketService.connect();

    const handleConnect = () => {
      updateConnectionStatus();
    };

    const handleDisconnect = () => {
      updateConnectionStatus();
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    return () => {
      clearInterval(interval);
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
    };
  }, []);

  const { isConnected, socketId } = connectionStatus;

  return (
    <div
      className="connection-status"
      style={{
        position: "fixed",
        top: "20px",
        right: "20px",
        zIndex: 1000,
        padding: "8px 16px",
        borderRadius: "20px",
        backgroundColor: isConnected ? "#d4edda" : "#f8d7da",
        border: `1px solid ${isConnected ? "#c3e6cb" : "#f5c6cb"}`,
        color: isConnected ? "#155724" : "#721c24",
        fontSize: "14px",
        fontWeight: "500",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        transition: "all 0.3s ease",
        cursor: isConnected ? "default" : "pointer",
      }}
      onClick={!isConnected ? handleReconnect : undefined}
      title={isConnected ? `Connected (ID: ${socketId})` : "Click to reconnect"}
    >
      {isReconnecting ? (
        <>
          <RefreshCw size={16} className="animate-spin" />
          Reconnecting...
        </>
      ) : isConnected ? (
        <>
          <Wifi size={16} />
          Live Updates Active
        </>
      ) : (
        <>
          <WifiOff size={16} />
          Disconnected - Click to reconnect
        </>
      )}
    </div>
  );
};

export default ConnectionStatus;
