const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Helper to extract and verify token
const extractToken = (req) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.split(" ")[1];
  }
  return null;
};

// Protect Middleware: Checks for token and valid user
const protect = async (req, res, next) => {
  const token = extractToken(req);
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    if (user.disabled) {
      return res.status(403).json({ message: "Account is disabled" });
    }

    req.user = user; // Attach user to request for access in controllers
    next();
  } catch (error) {
    console.error("Token verification error:", error); // Log error for debugging
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};

// Admin-Only Middleware: Allows only Admins access to certain routes
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Access denied: Admins only" });
  }
};

module.exports = { protect, adminOnly };
