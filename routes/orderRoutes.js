// routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const {
    createOrder,
    getOrderById,
    getMyOrders,
    getOrders, // For admin
    updateOrderToDelivered, // For admin
    updateOrderStatus // For admin - hàm mới
} = require('../controllers/orderController'); // Đảm bảo đường dẫn đúng
const { verifyToken, isAdmin } = require('../middleware/auth.middleware'); // Đảm bảo đường dẫn đúng

// User routes (require login)
// POST /api/orders/
router.post('/', verifyToken, createOrder);
// GET /api/orders/myorders
router.get('/myorders', verifyToken, getMyOrders); // Lấy đơn hàng của user đang đăng nhập
// GET /api/orders/:id
router.get('/:id', verifyToken, getOrderById); // Lấy chi tiết đơn hàng (user hoặc admin)

// Admin routes (require login and admin role)
// GET /api/orders/all (hoặc chỉ GET /api/orders/ nếu không có route public nào cho orders)
router.get('/all/list', verifyToken, isAdmin, getOrders); // Lấy tất cả đơn hàng cho admin
// PUT /api/orders/:id/deliver
router.put('/:id/deliver', verifyToken, isAdmin, updateOrderToDelivered);
// PUT /api/orders/:id/status (Route mới để cập nhật trạng thái đơn hàng chung)
router.put('/:id/status', verifyToken, isAdmin, updateOrderStatus);


module.exports = router;
