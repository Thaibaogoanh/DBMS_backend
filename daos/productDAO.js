// dao/product.dao.js
const Product = require('../models/Product.js');


// Lấy tất cả sản phẩm
const getAllProducts = async () => {
  return await Product.findAll();
};

const getProductById = async (id) => {
  return await Product.findByPk(id);
};

// Thêm sản phẩm mới
const createProduct = async ({ name, description, price, stock, imageUrl }) => {
    return await Product.create({ name, description, price, stock, imageUrl });
};
  
  // Cập nhật sản phẩm
const updateProduct = async (id, { name, description, price, stock, imageUrl }) => {
    const product = await Product.findByPk(id);
    if (!product) return null;
  
    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.stock = stock || product.stock;
    product.imageUrl = imageUrl || product.imageUrl;
  
    await product.save();
    return product;
};
  
  // Xóa sản phẩm
const deleteProduct = async (id) => {
    const product = await Product.findByPk(id);
    if (!product) return null;
  
    await product.destroy();
    return true;
};

const { Op } = require('sequelize');

// Tìm sản phẩm theo tên hoặc mô tả
const searchProducts = async (query) => {
  try {
    return await Product.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.iLike]: `%${query}%` } },
          { description: { [Op.iLike]: `%${query}%` } }
        ]
      }
    });
  } catch (err) {
    console.error('DAO search error:', err);
    throw err;
  }
};

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    searchProducts,
};
