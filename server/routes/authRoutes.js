const express = require("express");
const { login, register, logout } = require("../controllers/authController");
const router = express.Router();

router.post("/login", login);
router.post("/register/:token", register);
router.post("/logout", logout);

module.exports = router;