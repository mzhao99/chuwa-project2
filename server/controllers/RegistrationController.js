const nodemailer = require("nodemailer");
const RegistrationToken = require("../models/RegistrationModel");
const User = require("../models/UserModel");
const bcrypt = require("bcryptjs");

const generateRegistrationToken = async (req, res, next) => {
  const { email } = req.body;

  try {
    // 检查用户是否已经存在
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 生成注册令牌
    const token = Math.random().toString(36).substring(2) + Date.now().toString(36);
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1小时有效期

    // 保存令牌到数据库
    const newToken = new RegistrationToken({
      token,
      email,
      status: "pending",
      expiresAt,
    });
    await newToken.save();

    // 使用Nodemailer发送邮件
    const transporter = nodemailer.createTransport({
      service: "gmail", // 或者您使用的邮件服务
      auth: {
        user: process.env.EMAIL_USER, // 设置您的邮箱
        pass: process.env.EMAIL_PASS, // 设置您的邮箱密码或应用专用密码
      },
    });

    const registrationLink = `${req.protocol}://${req.get("host")}/register/${token}`;
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Registration Link",
      html: `<p>Please click the link below to register:</p><a href="${registrationLink}">${registrationLink}</a>`,
    });

    res.status(200).json({ message: "Registration link sent successfully", token });
  } catch (err) {
    next(err);
  }
};

const registerUser = async (req, res, next) => {
  const { token, username, password, email } = req.body;

  try {
    // 验证令牌
    const registrationToken = await RegistrationToken.findOne({ token, email });
    if (!registrationToken) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }
    if (registrationToken.status !== "pending" || new Date() > registrationToken.expiresAt) {
      return res.status(400).json({ message: "Token is no longer valid" });
    }

    // 创建新用户
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      email,
      password: hashedPassword,
      role: "employee",
    });
    await newUser.save();

    // 更新令牌状态
    registrationToken.status = "used";
    await registrationToken.save();

    res.status(201).json({ message: "Registration successful", user: { email, username } });
  } catch (err) {
    next(err);
  }
};

module.exports = { generateRegistrationToken, registerUser };
