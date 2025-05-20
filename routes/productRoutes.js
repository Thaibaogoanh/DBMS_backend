// routes/productRoutes.js
const express = require('express');
const router = express.Router();
const {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    createProductReview
} = require('../controllers/productController'); // Đảm bảo đường dẫn đúng
const { verifyToken, isAdmin } = require('../middleware/auth.middleware'); // Đảm bảo đường dẫn đúng

// Public routes
// GET /api/products/
router.get('/', getProducts);
// GET /api/products/:id
router.get('/:id', getProductById);

// Admin routes for managing products
// POST /api/products/
router.post('/', verifyToken, isAdmin, createProduct);
// PUT /api/products/:id
router.put('/:id', verifyToken, isAdmin, updateProduct);
// DELETE /api/products/:id
router.delete('/:id', verifyToken, isAdmin, deleteProduct);

// User specific routes (require login)
// POST /api/products/:id/reviews
router.post('/:id/reviews', verifyToken, createProductReview);

module.exports = router;
