// server.js

const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const users = require("./users");
const authenticateToken = require("./authMiddleware");

const app = express();
app.use(express.json());

const SECRET_KEY = "YOUR_SECRET_KEY_HERE";

// Login Route
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Find user
  const user = users.find((u) => u.username === username);
  if (!user) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  // Compare password
  const isPasswordValid = bcrypt.compareSync(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  // Generate JWT
  const token = jwt.sign(
    {
      userId: user.id,
      role: user.role,
    },
    SECRET_KEY,
    { expiresIn: "1h" }
  );

  res.json({ token });
});

// Protected Profile Route
app.get("/profile", authenticateToken, (req, res) => {
  res.json({
    userId: req.user.userId,
    role: req.user.role,
  });
});

// Admin-only Route
app.get("/admin", authenticateToken, (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied" });
  }

  res.json({ message: "Welcome Admin! You have full access." });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
