const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  createUser,
  claimPoints,
  getLeaderboard,
  getPointHistory,
} = require("../controllers/userController");

/**
 * @route   GET /api/users
 * @desc    Get all users
 * @access  Public
 */
router.get("/", getAllUsers);

/**
 * @route   POST /api/users
 * @desc    Create a new user
 * @access  Public
 */
router.post("/", createUser);

/**
 * @route   POST /api/users/:userId/claim
 * @desc    Claim random points for a user
 * @access  Public
 */
router.post("/:userId/claim", claimPoints);

/**
 * @route   GET /api/users/leaderboard
 * @desc    Get leaderboard with pagination
 * @access  Public
 */
router.get("/leaderboard", getLeaderboard);

/**
 * @route   GET /api/users/history
 * @desc    Get point claim history
 * @access  Public
 */
router.get("/history", getPointHistory);

module.exports = router;
