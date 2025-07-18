const mongoose = require("mongoose");

/**
 * Point History Schema for tracking all point claims
 */
const pointHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    pointsAwarded: {
      type: Number,
      required: true,
      min: 1,
      max: 10,
    },
    previousTotal: {
      type: Number,
      required: true,
      min: 0,
    },
    newTotal: {
      type: Number,
      required: true,
      min: 0,
    },
    claimedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient querying by user and date
pointHistorySchema.index({ userId: 1, claimedAt: -1 });
pointHistorySchema.index({ claimedAt: -1 });

module.exports = mongoose.model("PointHistory", pointHistorySchema);
