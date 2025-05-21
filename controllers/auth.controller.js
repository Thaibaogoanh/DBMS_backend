// controllers/auth.controller.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models'); // Giả sử models/index.js export User

// Hàm tạo JWT token
const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '1d' // Nên có giá trị mặc định
    });
};

// Register new user
const register = async (req, res, next) => {
    try {
        const { name, email, password, phone, address } = req.body;

        // Kiểm tra xem người dùng đã tồn tại chưa
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists with this email.' });
        }

        // Tạo người dùng mới (mật khẩu sẽ được hash bởi hook trong model User)
        const user = await User.create({
            name,
            email,
            password,
            phone,
            address,
            role: 'user', // Mặc định vai trò là 'user'
            isActive: true // Mặc định là active
        });

        // Tạo token
        const token = generateToken(user.id);

        res.status(201).json({
            message: 'User registered successfully.',
            token,
            user: { // Trả về thông tin cơ bản của người dùng, không bao gồm mật khẩu
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone,
                address: user.address,
                isActive: user.isActive
            }
        });
    } catch (error) {
        // Chuyển lỗi cho error handler chung nếu có, hoặc xử lý tại chỗ
        console.error('Register error:', error);
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ message: error.errors.map(e => e.message).join(', ') });
        }
        res.status(500).json({ message: 'Error registering user.', error: error.message });
        // Hoặc: next(error); 
    }
};

// Login user
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Tìm người dùng bằng email
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        // Kiểm tra mật khẩu (sử dụng phương thức đã định nghĩa trong model User)
        const isMatch = await user.checkPassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        if (!user.isActive) {
            return res.status(403).json({ message: 'User account is deactivated.' });
        }

        // Tạo token
        const token = generateToken(user.id);

        res.json({
            message: 'Login successful.',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Error logging in.', error: error.message });
        // Hoặc: next(error);
    }
};

// Logout user
const logout = async (req, res, next) => {
    try {
        // Đối với JWT, việc logout chủ yếu là phía client xóa token.
        // Nếu cần blacklist token phía server, bạn cần logic phức tạp hơn (ví dụ: lưu vào DB).
        res.json({ message: 'Logged out successfully.' });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ message: 'Error logging out.', error: error.message });
        // Hoặc: next(error);
    }
};

// Get user profile
const getProfile = async (req, res, next) => {
    try {
        // req.user được gán bởi middleware verifyToken và đã loại trừ password
        const user = req.user; 
        if (!user) { // Kiểm tra này có thể thừa nếu verifyToken đã xử lý
             return res.status(404).json({ message: 'User not found.' });
        }
        res.json(user);
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ message: 'Error fetching profile.', error: error.message });
        // Hoặc: next(error);
    }
};

// Update user profile
const updateProfile = async (req, res, next) => {
    try {
        const { name, phone, address, image } = req.body;
        // Tìm user bằng id từ token (đã được xác thực)
        const user = await User.findByPk(req.user.id);

        if (!user) { // Mặc dù verifyToken đã kiểm tra, nhưng kiểm tra lại không thừa
            return res.status(404).json({ message: 'User not found.' });
        }

        // Cập nhật các trường được phép
        user.name = name || user.name;
        user.phone = phone || user.phone;
        user.address = address || user.address;
        user.image = image || user.image; // Thêm image nếu có

        await user.save();
        
        // Trả về thông tin user đã cập nhật (không có password)
        const { password, ...userWithoutPassword } = user.toJSON();

        res.json({
            message: 'Profile updated successfully.',
            user: userWithoutPassword
        });
    } catch (error) {
        console.error('Update profile error:', error);
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({ message: error.errors.map(e => e.message).join(', ') });
        }
        res.status(500).json({ message: 'Error updating profile.', error: error.message });
        // Hoặc: next(error);
    }
};

// Change password
const changePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: 'Current password and new password are required.' });
        }
        if (newPassword.length < 6) { // Ví dụ: validation cơ bản
            return res.status(400).json({ message: 'New password must be at least 6 characters long.' });
        }

        const user = await User.findByPk(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Kiểm tra mật khẩu hiện tại
        const isMatch = await user.checkPassword(currentPassword);
        if (!isMatch) {
            return res.status(401).json({ message: 'Current password is incorrect.' });
        }

        // Cập nhật mật khẩu (hook trong model User sẽ hash mật khẩu mới)
        user.password = newPassword;
        await user.save();

        res.json({ message: 'Password changed successfully.' });
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({ message: 'Error changing password.', error: error.message });
        // Hoặc: next(error);
    }
};

module.exports = {
    register,
    login,
    logout,
    getProfile,
    updateProfile,
    changePassword,
    // generateToken // Không cần export nếu chỉ dùng nội bộ
};
