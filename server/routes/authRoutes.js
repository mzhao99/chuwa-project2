const express = require("express");
const { login, register, logout, registerLinkSend, registerLinkVerify } = require("../controllers/authController");
const router = express.Router();

router.post("/login", login);
router.post("/register/send-link", registerLinkSend);  // hr send link
router.get("/register/:token", registerLinkVerify);  // verify if the link is still valid 
router.post("/register", register);
router.post("/logout", logout);

module.exports = router;