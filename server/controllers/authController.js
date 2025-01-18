const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");
const CustomAPIError = require("../errors");
const bcrypt = require('bcryptjs');

const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    // Check if user exists
    if (!user) {
      // throw new CustomAPIError("Invalid Credentials", 400);
      return res.status(400).json({ message: "Invalid Credentials" });
    }
    // Check if password match
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }
    
    const payload = {
      user: {
        id: user._id,
        role: user.role,
      },
    };
    const token = await jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.status(200).json({ token });
  } catch (err) {
    next(err);
  }
};

const signup = async (req, res, next) => {
  const { email, password, role } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new user
    const salt = await bcrypt.genSalt(10); 
    const hashedPassword = await bcrypt.hash(password, salt); 
    const newUser = new User({
      email,
      password: hashedPassword, 
      role,
    });
    await newUser.save();

    res.status(201).json({
      message: "Sign up successful",
      user: {
        id: newUser._id,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (err) {
    next(err);
  }
};

const updatePassword = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate a token for the password reset
    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({
      message: "Reset link sent",
      email,
    });
  } catch (err) {
    next(err);
  }
};

const logout = (req, res) => {
  // Logout is handles by client side token deletion
  res.json({ message: 'Logout successful' });
};

module.exports = { login, signup, updatePassword, logout };
