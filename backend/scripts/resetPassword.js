const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

// Reset password for guest user
const resetGuestPassword = async () => {
  try {
    // Import User model
    const User = require("../models/userModel");
    
    // Find the guest user
    const guestUser = await User.findOne({ email: "guest@example.com" });
    
    if (!guestUser) {
      console.log("Guest user not found. Creating new guest user...");
      
      // Create new guest user with correct password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash("123456", salt);
      
      const newGuestUser = new User({
        name: "Guest User",
        email: "guest@example.com",
        password: hashedPassword,
        pic: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
        isAdmin: false
      });
      
      await newGuestUser.save();
      console.log("New guest user created successfully!");
      console.log("Email: guest@example.com");
      console.log("Password: 123456");
      
    } else {
      console.log("Guest user found. Resetting password...");
      
      // Reset password to "123456"
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash("123456", salt);
      
      guestUser.password = hashedPassword;
      await guestUser.save();
      
      console.log("Guest user password reset successfully!");
      console.log("Email: guest@example.com");
      console.log("Password: 123456");
    }
    
  } catch (error) {
    console.error("Error resetting password:", error);
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log("Database connection closed");
  }
};

// Run the script
const runScript = async () => {
  await connectDB();
  await resetGuestPassword();
  process.exit(0);
};

runScript(); 