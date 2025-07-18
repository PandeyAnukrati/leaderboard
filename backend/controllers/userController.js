const User = require("../models/User");
const PointHistory = require("../models/PointHistory");

/**
 * Generate random points between 1 and 10
 */
const generateRandomPoints = () => {
  return Math.floor(Math.random() * 10) + 1;
};

/**
 * Update all users' ranks based on their total points
 */
const updateAllRanks = async () => {
  try {
    const users = await User.find().sort({ totalPoints: -1 });

    for (let i = 0; i < users.length; i++) {
      users[i].rank = i + 1;
      await users[i].save();
    }

    return users;
  } catch (error) {
    throw new Error("Error updating ranks: " + error.message);
  }
};

/**
 * Get all users with their current rankings
 */
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ totalPoints: -1 });

    // Update ranks if needed
    await updateAllRanks();

    const updatedUsers = await User.find().sort({ totalPoints: -1 });

    res.json({
      success: true,
      data: updatedUsers,
      count: updatedUsers.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching users",
      error: error.message,
    });
  }
};

/**
 * Create a new user
 */
const createUser = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || name.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: "Name is required and must be at least 2 characters long",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      name: { $regex: new RegExp(`^${name.trim()}$`, "i") },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this name already exists",
      });
    }

    const user = new User({
      name: name.trim(),
      totalPoints: 0,
    });

    await user.save();

    // Update ranks after adding new user
    await updateAllRanks();

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating user",
      error: error.message,
    });
  }
};

/**
 * Claim points for a specific user
 */
const claimPoints = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const pointsAwarded = generateRandomPoints();
    const previousTotal = user.totalPoints;
    const newTotal = previousTotal + pointsAwarded;

    // Update user's total points
    user.totalPoints = newTotal;
    await user.save();

    // Create point history record
    const pointHistory = new PointHistory({
      userId: user._id,
      userName: user.name,
      pointsAwarded,
      previousTotal,
      newTotal,
      claimedAt: new Date(),
    });

    await pointHistory.save();

    // Update all users' ranks
    await updateAllRanks();

    // Get updated user data
    const updatedUser = await User.findById(userId);

    res.json({
      success: true,
      message: `${pointsAwarded} points awarded to ${user.name}!`,
      data: {
        user: updatedUser,
        pointsAwarded,
        previousTotal,
        newTotal,
        historyId: pointHistory._id,
      },
    });

    // Emit real-time update (will be handled by socket.io)
    if (req.io) {
      const allUsers = await User.find().sort({ totalPoints: -1 });
      req.io.emit("leaderboardUpdate", {
        users: allUsers,
        lastClaim: {
          user: updatedUser,
          pointsAwarded,
          timestamp: new Date(),
        },
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error claiming points",
      error: error.message,
    });
  }
};

/**
 * Get leaderboard with rankings
 */
const getLeaderboard = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const users = await User.find()
      .sort({ totalPoints: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalUsers = await User.countDocuments();
    const totalPages = Math.ceil(totalUsers / limit);

    res.json({
      success: true,
      data: users,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalUsers,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching leaderboard",
      error: error.message,
    });
  }
};

/**
 * Get point history for all users or specific user
 */
const getPointHistory = async (req, res) => {
  try {
    const { userId, page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    let query = {};
    if (userId) {
      query.userId = userId;
    }

    const history = await PointHistory.find(query)
      .populate("userId", "name")
      .sort({ claimedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalHistory = await PointHistory.countDocuments(query);
    const totalPages = Math.ceil(totalHistory / limit);

    res.json({
      success: true,
      data: history,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalHistory,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching point history",
      error: error.message,
    });
  }
};

module.exports = {
  getAllUsers,
  createUser,
  claimPoints,
  getLeaderboard,
  getPointHistory,
};
