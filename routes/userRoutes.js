// routes/user.routes.js
const express = require('express');
const router = express.Router();

// Import các hàm từ userController (phiên bản đã cập nhật cho admin)
const {
    getAllUsers,
    updateUserByAdmin
    // Thêm các hàm khác nếu cần, ví dụ: getUserByIdByAdmin, deleteUserByAdmin
} = require('../controllers/userController'); // Đảm bảo đường dẫn này đúng

// Import middleware xác thực và phân quyền
const { verifyToken, isAdmin } = require('../middleware/auth.middleware'); // Đảm bảo đường dẫn này đúng

// Tất cả các route trong file này yêu cầu phải là Admin
router.use(verifyToken, isAdmin);

// GET /api/users/ (Lấy tất cả người dùng - Admin)
router.get('/', getAllUsers);

// PUT /api/users/:userId (Cập nhật thông tin người dùng bởi Admin)
router.put('/:userId', updateUserByAdmin);

// GET /api/users/:userId (Lấy thông tin chi tiết một người dùng bởi Admin - ví dụ)
// router.get('/:userId', getUserByIdByAdmin);

// DELETE /api/users/:userId (Xóa người dùng bởi Admin - ví dụ)
// router.delete('/:userId', deleteUserByAdmin);


module.exports = router;
