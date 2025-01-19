const express = require("express");
const auth = require("../middleware/auth"); // 引入 auth 中间件
const { getEmployees, addEmployee, updateEmployee, deleteEmployee } = require("../controllers/EmployeeController");

const router = express.Router();


const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
  next();
};


router.get("/", getEmployees);

router.post("/", auth, isAdmin, addEmployee);

router.put("/:id", auth, isAdmin, updateEmployee);

router.delete("/:id", auth, isAdmin, deleteEmployee);

module.exports = router;
