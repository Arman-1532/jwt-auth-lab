// authMiddleware.js

const jwt = require("jsonwebtoken");

const SECRET_KEY = "YOUR_SECRET_KEY_HERE";

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];

  // Check if header exists
  if (!authHeader) {
    return res.status(401).json({ message: "Token missing" });
  }

  // Extract token from "Bearer <token>"
  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Invalid token format" });
  }

  // Verify token
  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }

    // Attach decoded payload
    req.user = user;
    next();
  });
}

module.exports = authenticateToken;
