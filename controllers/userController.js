// controllers/userController.js
const { User } = require('../models');

// Các hàm trong file này sẽ tập trung vào quản lý người dùng từ góc độ admin
// hoặc các tương tác người dùng không liên quan trực tiếp đến xác thực của người dùng hiện tại.

// Ví dụ: Lấy danh sách tất cả người dùng (chỉ dành cho Admin)
const getAllUsers = async (req, res, next) => {
    // Middleware isAdmin nên được áp dụng cho route này
    try {
        const users = await User.findAll({
            attributes: { exclude: ['password'] } // Luôn loại trừ mật khẩu
        });
        res.json(users);
    } catch (error) {
        console.error('Get all users error:', error);
        res.status(500).json({ message: 'Error fetching users.', error: error.message });
        // Hoặc: next(error);
    }
};

// Ví dụ: Admin cập nhật thông tin người dùng (bao gồm cả vai trò)
const updateUserByAdmin = async (req, res, next) => {
    // Middleware isAdmin nên được áp dụng
    try {
        const { userId } = req.params;
        const { name, email, role, isActive, phone, address } = req.body;

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Kiểm tra email mới có bị trùng không nếu email được thay đổi
        if (email && email !== user.email) {
            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                return res.status(400).json({ message: 'Email already in use by another account.' });
            }
        }
        
        user.name = name || user.name;
        user.email = email || user.email;
        user.role = role || user.role;
        user.isActive = typeof isActive === 'boolean' ? isActive : user.isActive;
        user.phone = phone || user.phone;
        user.address = address || user.address;

        // Mật khẩu nên được đặt lại qua một quy trình riêng nếu admin cần
        // Không nên cho phép admin đặt mật khẩu trực tiếp ở đây mà không có cơ chế an toàn

        await user.save();
        const { password, ...userWithoutPassword } = user.toJSON();
        res.json({ message: 'User updated successfully by admin.', user: userWithoutPassword });

    } catch (error) {
        console.error('Update user by admin error:', error);
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ message: error.errors.map(e => e.message).join(', ') });
        }
        res.status(500).json({ message: 'Error updating user by admin.', error: error.message });
        // Hoặc: next(error);
    }
};


// Các hàm registerUser, loginUser, getUserProfile, updateUserProfile (cho người dùng tự cập nhật)
// đã được chuyển sang auth.controller.js.

module.exports = {
    getAllUsers,       // Ví dụ hàm mới cho admin
    updateUserByAdmin, // Ví dụ hàm mới cho admin
    // Các hàm cũ (registerUser, loginUser, getUserProfile, updateUserProfile) đã bị loại bỏ khỏi đây
};
