import axios from "axios";

// Create axios instance with base configuration
const api = axios.create({
  baseURL: `${process.env.REACT_APP_BACKEND_URL}/api`,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(
      `Making ${config.method?.toUpperCase()} request to ${config.url}`
    );
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error("Response error:", error);

    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      console.error(`API Error ${status}:`, data.message || "Unknown error");
    } else if (error.request) {
      // Request was made but no response received
      console.error("Network error: No response received");
    } else {
      // Something else happened
      console.error("Request setup error:", error.message);
    }

    return Promise.reject(error);
  }
);

/**
 * API service functions
 */
export const userService = {
  // Get all users
  getAllUsers: async () => {
    try {
      const response = await api.get("/users");
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to fetch users");
    }
  },

  // Create a new user
  createUser: async (userData) => {
    try {
      const response = await api.post("/users", userData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to create user");
    }
  },

  // Claim points for a user
  claimPoints: async (userId) => {
    try {
      const response = await api.post(`/users/${userId}/claim`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to claim points"
      );
    }
  },

  // Get leaderboard with pagination
  getLeaderboard: async (page = 1, limit = 10) => {
    try {
      const response = await api.get(
        `/users/leaderboard?page=${page}&limit=${limit}`
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch leaderboard"
      );
    }
  },

  // Get point history
  getPointHistory: async (userId = null, page = 1, limit = 20) => {
    try {
      const params = new URLSearchParams({ page, limit });
      if (userId) params.append("userId", userId);

      const response = await api.get(`/users/history?${params}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch point history"
      );
    }
  },

  // Health check
  healthCheck: async () => {
    try {
      const response = await api.get("/health");
      return response.data;
    } catch (error) {
      throw new Error("API health check failed");
    }
  },
};

export default api;
