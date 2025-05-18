const express = require('express');
const router = express.Router();
const {
    createOrder,
    getOrderById,
    getMyOrders,
    getOrders,
    updateOrderToDelivered
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/auth');

// @route   POST /api/orders
router.post('/orders', protect, createOrder);

// @route   GET /api/orders/:id
router.get('/orders/:id', protect, getOrderById);

// @route   GET /api/orders/myorders
router.get('/orders/myorders', protect, getMyOrders);

// @route   GET /api/orders
router.get('/orders', protect, admin, getOrders);

// @route   PUT /api/orders/:id/deliver
router.put('/orders/:id/deliver', protect, admin, updateOrderToDelivered);

module.exports = router; 