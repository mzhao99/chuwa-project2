const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");

let transporter = null;
if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}

const generateRegistrationToken = (email) => {
  return jwt.sign({ id: email }, process.env.JWT_SECRET, { expiresIn: "3h" });
};

const sendRegistrationEmail = async (email, name, token) => {
  if (!transporter) {
    throw new Error("Email configuration not set up");
  }

  const registrationLink = `${process.env.FRONTEND_URL}/register/${token}`;
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Complete Your Registration",
    text: `Welcome ${name}! Please complete your registration using this link: ${registrationLink}`,
    html: `
        <h2>Welcome ${name}!</h2>
        <p>Please complete your registration by clicking the link below:</p>
        <a href="${registrationLink}">Complete Registration</a>
        <p>This link will expire in 3 hours.</p>
      `,
  };

  await transporter.sendMail(mailOptions);
};

const registerLinkSend = async (req, res, next) => {
  const { email, name } = req.body;

  try {
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    // Check if email exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const token = generateRegistrationToken(email);
    const newUser = new User({
      email,
      username: "temporary_username",  
      password: "temporary_password",  
      role: "regular",                   
      registration: {
        token,
        status: "sent",
        expiresAt: Date.now() + 3 * 60 * 60 * 1000, 
      },
    });
    await newUser.save();
    await sendRegistrationEmail(email, name, token);
    res.status(200).json({ message: "Registration email sent successfully" });
  } catch (err) {
    next(err);
  }
};

const registerLinkVerify = async (req, res) => {
  const { token } = req.params;

  try {
    // Find user by registration token
    const user = await User.findOne({ "registration.token": token });
    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }
    // Check if token is valid and not expired
    if (user.registration.status !== "sent" || user.registration.expiresAt < Date.now()) {
      return res.status(400).json({ message: "Token expired or already used" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.status(200).json({ message: "Token is valid", id: decoded.id });
  } catch (error) {
    res.status(400).json({ message: "Invalid token" });
  }
};

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
  const { email, username, password, token } = req.body;

  try {
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Find the user by the registration token
    const user = await User.findOne({ "registration.token": token });
    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }
    // Check if token is still valid
    if (user.registration.status !== "sent" || user.registration.expiresAt < Date.now()) {
      return res.status(400).json({ message: "Token expired or already used" });
    }
    // Create new user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    user.username = username;
    user.password = hashedPassword;
    user.registration.status = "used"; 
    await user.save();

    res.status(201).json({
      message: "Sign up successful",
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
        registration: {
          token: user.registration.token,
          status: user.registration.status,
          expiresAt: user.registration.expiresAt,
        }
      },
    });
  } catch (err) {
    next(err);
  }
};

const logout = (req, res) => {
  // Logout is handles by client side token deletion
  res.json({ message: "Logout successful" });
};

module.exports = {
  login,
  register,
  logout,
  registerLinkSend,
  registerLinkVerify,
};