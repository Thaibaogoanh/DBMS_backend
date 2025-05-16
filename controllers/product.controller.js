const productDao = require('../daos/productDAO.js');
// const { Op } = require('sequelize');
const ProductReview = require('../models/ProductReview');
const Product = require('../models/Product'); // Đảm bảo đường dẫn và tên model đúng
const User = require('../models/User');

// Lấy tất cả sản phẩm
const getAllProducts = async (req, res) => {
  try {
    const products =await productDao.getAllProducts();
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getProductById = async (req, res) => {
  const { id } = req.params; // Lấy id từ params trong URL

  try {
    const product = await productDao.getProductById(id); // Truyền id vào hàm DAO
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product); // Trả về sản phẩm nếu tìm thấy
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getProductReviewById = async (req, res) => {
  const { id } = req.params;  // Lấy product_id từ params trong URL

  try {
    // Tìm sản phẩm theo id
    const product = await Product.findByPk(id);

    // Kiểm tra nếu sản phẩm không tồn tại
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Lấy tất cả review của sản phẩm này
    const reviews = await ProductReview.findAll({
      where: { product_id: id },
      order: [['review_date', 'DESC']], // Sắp xếp theo ngày đánh giá (tùy chọn)
    });

    // Kiểm tra nếu không có review nào
    if (reviews.length === 0) {
      return res.status(404).json({ message: 'No reviews found for this product' });
    }

    // Trả về danh sách các review
    res.status(200).json({ product_id: id, reviews });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ message: 'Error fetching reviews', error: error.message });
  }
};

// Thêm sản phẩm mới
const createProduct = async (req, res) => {
  try {
    const newProduct = await productDao.createProduct(req.body);
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Cập nhật sản phẩm
const updateProduct = async (req, res) => {
  try {
    const updatedProduct = await productDao.updateProduct(req.params.id, req.body);
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Xóa sản phẩm
const deleteProduct = async (req, res) => {
  try {
    const deleted = await productDao.deleteProduct(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const searchProducts = async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) {
      return res.status(400).json({ message: 'Missing search query' });
    }

    const results = await productDao.searchProducts(query); // <-- Truyền query thôi
    res.status(200).json(results);
  } catch (error) {
    console.error('Controller search error:', error);
    res.status(500).json({ message: 'Search failed' });
  }
};
// async (req, res) => {
//   const query = req.query.q || '';
//   if (!query) return res.status(400).json({ message: 'Missing search query' });

//   try {
//     const results = await searchProducts(query);
//     res.json(results);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Search failed' });
//   }
// };

module.exports = {
  getAllProducts,
  getProductById,
  getProductReviewById,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProducts,
};
