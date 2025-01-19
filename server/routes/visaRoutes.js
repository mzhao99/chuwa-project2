const express = require("express");
const { createVisa, getVisaByEmployeeId, updateVisa, getAllVisas } = require("../controllers/visaManagementController");
const router = express.Router();

router.post("/", createVisa);
router.get("/:employeeId", getVisaByEmployeeId);  
router.put("/:id", updateVisa);
router.get("/", getAllVisas)

module.exports = router;