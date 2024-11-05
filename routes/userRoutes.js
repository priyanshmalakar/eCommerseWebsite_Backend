const usercontroller = require("../controller/userController");
const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
router.post(
  "/register",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 }),
  ],
  usercontroller.register
);
// @desc    Login user
// @route   POST /api/users/login
// @access  Public
router.post(
  "/login",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists(),
  ],
  usercontroller.login
);
// @desc    Get logged in user
// @route   GET /api/users/me
// @access  Private
router.get("/me", usercontroller.getMe);
module.exports = router;
