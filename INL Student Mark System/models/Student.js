const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  Student_ID: String,
  First_Name: String,
  Last_Name: String,
  Attendance_Percentage: Number,
  Assignment_Average: Number,
  Late_Submissions: Number,
  Risk_Level: Number,
  Classification: String,
  Email: { 
    type: String, 
    required: true, 
    unique: true, // Vital for the /my-data route
    lowercase: true 
  },
  Address: String
});

module.exports = mongoose.model("Student", studentSchema);