const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true, // This is the "Security Guard"
    lowercase: true, 
    trim: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  role: { 
    type: String, 
    required: true,
    enum: ["student", "teacher"] // Matches your comment logic
  }
});

module.exports = mongoose.model("User", userSchema);