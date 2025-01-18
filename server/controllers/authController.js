const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");
const bcrypt = require('bcryptjs');

const login = async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    // Check if user exists
    if (!user) {
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

const register = async (req, res, next) => {
  const { email, username, password } = req.body;

  try {
    // Check if user already exists
    const existingUserEmail = await User.findOne({ email });
    if (existingUserEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Create new user
    const salt = await bcrypt.genSalt(10); 
    const hashedPassword = await bcrypt.hash(password, salt); 
    const newUser = new User({
      email,
      username,
      password: hashedPassword, 
      role: "employee",
    });
    await newUser.save();

    res.status(201).json({
      message: "Sign up successful",
      user: {
        id: newUser._id,
        email: newUser.email,
        username: newUser.username,
        role: newUser.role,
      },
    });
  } catch (err) {
    next(err);
  }
};


const logout = (req, res) => {
  // Logout is handles by client side token deletion
  res.json({ message: 'Logout successful' });
};

module.exports = { login, register, logout };
