const express = require("express");
const { login, signup, updatePassword, logout } = require("../controllers/authController");
const router = express.Router();

router.post("/login", login);
router.post("/signup", signup);
router.post("/update-password", updatePassword);
router.post("/logout", logout);

module.exports = router;