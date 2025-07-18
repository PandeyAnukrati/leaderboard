const mongoose = require("mongoose");

/**
 * User Schema for storing user information and total points
 */
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    totalPoints: {
      type: Number,
      default: 0,
      min: 0,
    },
    rank: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient sorting by totalPoints
userSchema.index({ totalPoints: -1 });

// Virtual for getting user's rank dynamically
userSchema.virtual("currentRank").get(function () {
  return this.rank;
});

// Method to update user's rank
userSchema.methods.updateRank = async function (newRank) {
  this.rank = newRank;
  return this.save();
};

module.exports = mongoose.model("User", userSchema);
