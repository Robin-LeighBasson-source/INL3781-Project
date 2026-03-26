const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
require("dotenv").config();

const Student = require("./models/Student");
const User = require("./models/User");
const { auth, isTeacher } = require("./middleware/auth");

const app = express();
app.use(express.json());
app.use(cors());

// CONNECT TO MONGODB (PASTE YOUR ATLAS URI HERE)
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));



// REGISTER USER
app.post("/register", async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // 1. Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send("User already exists with this email!");
    }

    // 2. If not, proceed with hashing and saving
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      email,
      password: hashedPassword,
      role
    });

    await user.save();
    res.send("User registered");
  } catch (err) {
    res.status(500).send(err.message);
  }
});



// LOGIN USER
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).send("User not found");

    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) return res.status(400).send("Invalid password");

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (err) {
    res.status(500).send(err.message);
  }
});



// GET ALL STUDENTS (TEACHER ONLY)
app.get("/students", auth, isTeacher, async (req, res) => {
  const students = await Student.find();
  res.json(students);
});



// GET OWN DATA (STUDENT)
app.get("/my-data", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    const student = await Student.findOne({ Email: user.email });

    res.json(student);
  } catch (err) {
    res.status(500).send(err.message);
  }
});


// RISK PREDICTION
app.get("/risk-prediction/:studentId", auth, isTeacher, async (req, res) => {
  try {
    const student = await Student.findById(req.params.studentId);
    if (!student) return res.status(404).send("Student not found");

    // Simple risk calculation based on attendance, assignments, late submissions
    let risk = 0;
    if (student.Attendance_Percentage < 75) risk += 30;
    if (student.Assignment_Average < 50) risk += 40;
    if (student.Late_Submissions > 5) risk += 30;

    student.Risk_Level = risk;
    student.Classification = risk > 50 ? "High Risk" : risk > 20 ? "Medium Risk" : "Low Risk";

    await student.save();
    res.json({ riskLevel: student.Risk_Level, classification: student.Classification });
  } catch (err) {
    res.status(500).send(err.message);
  }
});


app.listen(5000, () => console.log("Server running on port 5000"));