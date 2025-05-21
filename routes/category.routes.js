// routes/category.routes.js
const express = require('express');
const router = express.Router();
const {
    getCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
    getCategoryProducts
} = require('../controllers/category.controller'); // Đảm bảo đường dẫn đúng
const { verifyToken, isAdmin } = require('../middleware/auth.middleware'); // Đảm bảo đường dẫn đúng

// Public routes
// GET /api/categories/
router.get('/', getCategories);
// GET /api/categories/:id
router.get('/:id', getCategoryById);
// GET /api/categories/:id/products
router.get('/:id/products', getCategoryProducts);

// Admin routes - Các route sau cần verifyToken và isAdmin
// POST /api/categories/
router.post('/', verifyToken, isAdmin, createCategory);
// PUT /api/categories/:id
router.put('/:id', verifyToken, isAdmin, updateCategory);
// DELETE /api/categories/:id
router.delete('/:id', verifyToken, isAdmin, deleteCategory);

module.exports = router;
