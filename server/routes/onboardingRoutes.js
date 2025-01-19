const express = require("express");
const { createOnboarding, getOnboardingByEmployeeId, updateOnboardingById, getAllOnboardings } = require("../controllers/onboardingController");
const router = express.Router();

router.post("/", createOnboarding);
router.get("/:employeeId", getOnboardingByEmployeeId);  
router.put("/:id", updateOnboardingById);
router.get("/", getAllOnboardings)

module.exports = router;