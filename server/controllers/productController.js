const Product = require('../models/ProductModel');

// 获取所有产品
const getProducts = async (req, res) => {
  try {
    const {
      orderBy = 'createdAt',
      order = 'asc',
      page = 1,
      limit = 10,
      searchStr,
    } = req.query;

    const filter = searchStr ? {name: {$regex: searchStr, $options: 'i'}} : {};

    const sort = {[orderBy]: order === 'asc' ? 1 : -1};

    const products = await Product.find(filter)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const totalItems = await Product.countDocuments(filter);
    const totalPages = Math.ceil(totalItems / limit);

    res.json({
      products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages,
        totalItems,
      },
    });
  } catch (err) {
    res
      .status(500)
      .json({error: 'Internal Server Error', details: err.message});
  }
};

// 添加新产品
const addProduct = async (req, res) => {
  if (req.user.role !== 'admin') {
    res.status(400).json({error: 'Not admin'});
  }
  try {
    const product = new Product(req.body);
    await product.save();
    res.json({message: 'Product added successfully', product});
  } catch (err) {
    res
      .status(500)
      .json({error: 'Failed to add product', details: err.message});
  }
};

// 更新产品
const updateProduct = async (req, res) => {
  if (req.user.role !== 'admin') {
    res.status(401).json({error: 'Not admin'});
  }
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!product) {
      return res.status(404).json({error: 'Product not found'});
    }
    res.json({message: 'Product updated successfully', product});
  } catch (err) {
    res
      .status(500)
      .json({error: 'Failed to update product', details: err.message});
  }
};

// 删除产品
const deleteProduct = async (req, res) => {
  if (req.user.role !== 'admin') {
    res.status(400).json({error: 'Not admin'});
  }
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({error: 'Product not found'});
    }
    res.json({message: 'Product deleted successfully'});
  } catch (err) {
    res
      .status(500)
      .json({error: 'Failed to delete product', details: err.message});
  }
};

module.exports = {getProducts, addProduct, updateProduct, deleteProduct};
