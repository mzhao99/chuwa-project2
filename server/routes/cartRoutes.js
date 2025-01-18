const express = require('express');
const {
  getCart,
  updateCartProduct,
  mergeCart,
  clearCart,
  applyDiscount,
  checkout,
} = require('../controllers/cartController');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/', auth, getCart);
router.patch('/', auth, updateCartProduct);
router.patch('/merge', auth, mergeCart);
router.delete('/', auth, clearCart);
router.put('/discount', auth, applyDiscount);
router.post('/checkout', auth, checkout);

module.exports = router;
