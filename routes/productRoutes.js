const express = require('express');
const router = express.Router();
const {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    createProductReview
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/auth');

// @route   GET /api/products
router.get('/products', getProducts);

// @route   GET /api/products/:id
router.get('/products/:id', getProductById);

// @route   POST /api/products
router.post('/products', protect, admin, createProduct);

// @route   PUT /api/products/:id
router.put('/products/:id', protect, admin, updateProduct);

// @route   DELETE /api/products/:id
router.delete('/products/:id', protect, admin, deleteProduct);

// @route   POST /api/products/:id/reviews
router.post('/products/:id/reviews', protect, createProductReview);

module.exports = router; 