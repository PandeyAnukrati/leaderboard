const mongoose = require("mongoose");
const User = require("../models/User");
require("dotenv").config();

/**
 * Seed script to create initial users in the database
 */
const seedUsers = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Connected to MongoDB");

    // Clear existing users
    await User.deleteMany({});
    console.log("Cleared existing users");

    // Initial users as specified in requirements
    const initialUsers = [
      { name: "Rahul", totalPoints: 0, rank: 1 },
      { name: "Kamal", totalPoints: 0, rank: 2 },
      { name: "Sanak", totalPoints: 0, rank: 3 },
      { name: "Priya", totalPoints: 0, rank: 4 },
      { name: "Amit", totalPoints: 0, rank: 5 },
      { name: "Sneha", totalPoints: 0, rank: 6 },
      { name: "Vikram", totalPoints: 0, rank: 7 },
      { name: "Anita", totalPoints: 0, rank: 8 },
      { name: "Rajesh", totalPoints: 0, rank: 9 },
      { name: "Meera", totalPoints: 0, rank: 10 },
    ];

    // Insert users
    const createdUsers = await User.insertMany(initialUsers);
    console.log(`Created ${createdUsers.length} users successfully`);

    // Display created users
    createdUsers.forEach((user, index) => {
      console.log(
        `${index + 1}. ${user.name} - Points: ${user.totalPoints} - Rank: ${
          user.rank
        }`
      );
    });

    console.log("Database seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

// Run the seed function
seedUsers();
