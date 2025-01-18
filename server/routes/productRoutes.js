// const express = require("express");
// const { addProduct, updateProduct, deleteProduct, getProducts } = require("../controllers/productController");
// const authToken = require("../middleware/auth");

// const router = express.Router();

// // Middleware to check admin role
// const isAdmin = (req, res, next) => {
//   if (req.user?.role !== "admin") {
//     return res.status(403).json({ message: "Access denied. Admins only." });
//   }
//   next();
// };

// // Routes
// router.get("/", getProducts); // Public route to get products
// router.post("/", authToken, isAdmin, addProduct); // Protected route for adding products
// router.put("/:id", authToken, isAdmin, updateProduct); // Protected route for updating products
// router.delete("/:id", authToken, isAdmin, deleteProduct); // Protected route for deleting products

// module.exports = router;

const express = require("express");
const auth = require("../middleware/auth"); // 引入 auth 中间件
const { getProducts, addProduct, updateProduct, deleteProduct } = require("../controllers/productController");

const router = express.Router();

// 检查是否是管理员
const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
  next();
};

// [GET] 获取所有产品（无需权限）
router.get("/", getProducts);

// [POST] 添加新产品（需要 admin 权限）
router.post("/", auth, isAdmin, addProduct);

// [PUT] 更新产品（需要 admin 权限）
router.put("/:id", auth, isAdmin, updateProduct);

// [DELETE] 删除产品（需要 admin 权限）
router.delete("/:id", auth, isAdmin, deleteProduct);

module.exports = router;
