const User = require("../model/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const SECRET_KEY = process.env.SECRET_KEY || "secretkeykeykey";

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public

console.log(SECRET_KEY, "sadfdsfsd");
exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  const { name, email, password, role } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    user = new User({
      name,
      role,
      email,
      password: hashedPassword,
    });

    await user.save();
    const payload = {
      user: {
        id: user.id,
      },
    };
    jwt.sign(payload, SECRET_KEY, { expiresIn: 3600 }, (err, token) => {
      if (err) throw err;
      res.status(200).json({ success: true, token });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// @desc    Login user
// @route   POST /api/users/login
// @access  Public
exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }
    const payload = {
      user: {
        id: user.id,
      },
    };
    jwt.sign(payload, SECRET_KEY, { expiresIn: 3600 }, (err, token) => {
      if (err) throw err;
      res.status(200).json({ success: true, token });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// @desc    Get logged in user
// @route   GET /api/users/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.status(200).json({ success: true, user });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
