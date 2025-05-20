// routes/auth.routes.js
const express = require('express');
const router = express.Router();

// Import các hàm từ auth.controller.js
const {
    register,
    login,
    logout,
    getProfile,
    updateProfile,
    changePassword
} = require('../controllers/auth.controller'); // Đảm bảo đường dẫn này đúng

// Import middleware xác thực đã hợp nhất
const { verifyToken } = require('../middleware/auth.middleware'); // Đảm bảo đường dẫn này đúng

// Public routes
// POST /api/auth/register
router.post('/register', register);
// POST /api/auth/login
router.post('/login', login);

// Protected routes - Áp dụng verifyToken cho tất cả các route bên dưới
router.use(verifyToken); // Tất cả các route sau dòng này sẽ yêu cầu token hợp lệ

// POST /api/auth/logout
router.post('/logout', logout); // Logout có thể cần verifyToken nếu xử lý phía server (blacklist)

// GET /api/auth/profile
router.get('/profile', getProfile);

// PUT /api/auth/profile
router.put('/profile', updateProfile);

// PUT /api/auth/change-password
router.put('/change-password', changePassword);

module.exports = router;
