const jwt = require("jsonwebtoken");
require("dotenv").config();

const auth = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) return res.status(401).send("Access Denied");

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).send("Invalid Token");
  }
};

// Role check
const isTeacher = (req, res, next) => {
  if (req.user.role !== "teacher") {
    return res.status(403).send("Teachers only");
  }
  next();
};

module.exports = { auth, isTeacher };