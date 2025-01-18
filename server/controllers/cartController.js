const mongoose = require('mongoose');
const Cart = require('../models/CartModel');
const Product = require('../models/ProductModel');

const getCart = async (req, res) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(204).json({message: 'Empty cart for anonymous user'});
  }

  try {
    const cart = await Cart.findOne({userId}).populate({
      path: 'items.product',
      select: '_id name price description stock imgUrl',
    });

    if (!cart) {
      return res.status(200).json({items: []});
    }

    return res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({message: `Server Error at getCart - ${err.message}`});
  }
};

const updateCartProduct = async (req, res) => {
  try {
    const userId = req.user?.id;
    const {productId, quantity} = req.body;
    if (!userId)
      return res
        .status(401)
        .json({message: 'Unauthorized: User is not logged in.'});

    let cart = await Cart.findOne({userId});

    // create empty cart if it is not existing for a new user
    if (!cart) {
      cart = new Cart({
        userId,
        items: [],
      });
    }

    if (quantity === 0) {
      cart.items = cart.items.filter(
        (item) => item.product?._id.toString() !== productId
      );
    } else {
      const existingItem = cart.items.find(
        (item) => item.product?._id.toString() === productId
      );

      if (existingItem) {
        existingItem.quantity = quantity;
      } else {
        cart.items.push({product: productId, quantity});
      }

      // Check if stock satisfy required quantity
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({message: 'Product not found.'});
      }
      if (quantity > product.stock) {
        return res.status(400).json({
          message: `Requested quantity(${quantity}) exceeds stock(${product.stock}).`,
        });
      }
    }

    await cart.save();
    await getProductDetails(cart);

    return res
      .status(200)
      .json({message: 'Cart is updated successfully.', cart});
  } catch (err) {
    console.error('Error at updateCartProduct:', err);
    res
      .status(500)
      .json({message: `Server Error at updateCartProducts - ${err.message}`});
  }
};

const mergeCart = async (req, res) => {
  const userId = req.user?.id;
  const {products} = req.body;
  if (!userId)
    return res
      .status(401)
      .json({message: 'Unauthorized: User is not logged in.'});

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Step1: Get user's current cart
    const cart = await Cart.findOne({userId}).session(session);
    // create empty cart if the user has no corresponding cart entry
    if (!cart) {
      await Cart.create([{userId, items: []}], {session});
    }

    // Step2: Build a map of existing product IDs for quick lookup
    const existingProductMap = new Map(
      cart.items.map((item) => [item.product._id.toString(), item.quantity])
    );

    // Step3: Get Update and Insert Products separately
    const updates = [];
    const inserts = [];

    for (const {productId, quantity} of products) {
      if (existingProductMap.has(productId)) {
        // Existing product: update quantity
        updates.push({
          updateOne: {
            filter: {userId, 'items.product': productId},
            update: {$set: {'items.$.quantity': quantity}},
          },
        });
      } else {
        // New product: prepare for insert
        inserts.push({product: productId, quantity});
      }
    }

    // Step 4: Execute bulk updates
    if (updates.length > 0) {
      await Cart.bulkWrite(updates, {session});
    }

    // Step 5: Insert new products
    if (inserts.length > 0) {
      await Cart.updateOne(
        {userId},
        {$addToSet: {items: {$each: inserts}}},
        {session}
      );
    }

    // Commit transaction
    await session.commitTransaction();
    // Reload updated cart with product details
    const updatedCart = await Cart.findOne({userId}).populate(
      'items.product',
      '_id name price description stock imgUrl'
    );

    return res
      .status(200)
      .json({message: 'Cart merged successfully.', cart: updatedCart});
  } catch (err) {
    await session.abortTransaction();
    res
      .status(500)
      .json({message: `Server Error at mergeCart - ${err.message}`});
  } finally {
    session.endSession();
  }
};

const clearCart = async (req, res) => {
  const userId = req.user?.id;
  if (!userId)
    return res
      .status(401)
      .json({message: 'Unauthorized: User is not logged in.'});

  try {
    // clear cart
    const cart = await Cart.findOneAndUpdate(
      {userId},
      {$set: {items: [], discount: 0}},
      {new: true} // return the updated cart
    );

    if (!cart) {
      return res.status(404).json({message: 'Cart not found.'});
    }

    return res.status(200).json({message: 'Cart cleared successfully.', cart});
  } catch (err) {
    return res
      .status(500)
      .json({message: `Server Error at clearCart: ${err.message}`});
  }
};

const checkout = async (req, res) => {
  const userId = req.user?.id;

  if (!userId) {
    return res
      .status(401)
      .json({message: 'Unauthorized: User is not logged in.'});
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const cart = await Cart.findOne({userId})
      .populate('items.product')
      .session(session);

    if (!cart || cart.items.length === 0) {
      await session.abortTransaction();
      return res.status(400).json({message: 'Cart is empty.'});
    }

    // Check stock
    const insufficientStock = [];
    for (const item of cart.items) {
      const product = item.product;
      if (product.stock < item.quantity) {
        insufficientStock.push({
          productId: product._id,
          name: product.name,
          requested: item.quantity,
          available: product.stock,
        });
      }
    }

    // If there is any product insufficient, return error
    if (insufficientStock.length > 0) {
      await session.abortTransaction();
      return res.status(400).json({
        message: 'Some products are out of stock.',
        insufficientStock,
      });
    }

    // Decrease stock
    for (const item of cart.items) {
      const product = item.product;
      product.stock -= item.quantity;
      await product.save({session});
    }

    // clear cart
    cart.items = [];
    cart.discount = 0;
    await cart.save({session});

    await session.commitTransaction();

    return res.status(200).json({message: 'Checkout successful.'});
  } catch (err) {
    await session.abortTransaction();
    console.error('Checkout error:', err);
    return res.status(500).json({message: `Server Error: ${err.message}`});
  } finally {
    await session.endSession();
  }
};

const applyDiscount = async (req, res) => {
  const userId = req.user?.id;
  const {code} = req.body;
  if (!userId)
    return res
      .status(401)
      .json({message: 'Unauthorized: User is not logged in.'});

  try {
    // Simulated with hard code discount hash table
    // TODO: Implement discount in database
    const discountTable = new Map([
      ['SAVE10', {amount: 10, expires: '2024-12-31'}],
      ['WELCOME20', {amount: 20, expires: '2025-01-15'}],
    ]);

    const discount = discountTable.get(code);
    if (!discount) {
      return res.status(404).json({message: 'Discount code not found.'});
    }

    // Check if the discount code is expired
    const now = new Date();
    const expirationDate = new Date(discount.expires);
    if (expirationDate < now) {
      return res.status(400).json({message: 'Discount code has expired.'});
    }

    let cart = await Cart.findOne({userId});
    if (!cart) {
      cart = new Cart({
        userId,
        items: [],
      });
    }

    cart.discount = discount.amount;
    await cart.save();
    await getProductDetails(cart);

    return res
      .status(200)
      .json({message: 'Discount code applied successfully', cart});
  } catch (err) {
    return res
      .status(500)
      .json({message: `Server Error at applyDiscount: ${err.message}`});
  }
};

const getProductDetails = async (cart) => {
  await cart.populate(
    'items.product',
    '_id name price description stock imgUrl'
  );
};

module.exports = {
  getCart,
  updateCartProduct,
  mergeCart,
  clearCart,
  applyDiscount,
  checkout,
};
