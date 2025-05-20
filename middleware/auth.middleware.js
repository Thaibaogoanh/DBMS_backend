// middleware/auth.middleware.js
const jwt = require('jsonwebtoken');
// Đảm bảo bạn import đúng model User từ vị trí của nó, ví dụ:
// const User = require('../models/User'); // Nếu User.js nằm trong thư mục models
// Hoặc nếu bạn dùng cấu trúc db từ models/index.js:
const { User } = require('../models'); // Giả sử bạn có file models/index.js export User

const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        let token;

        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({ message: 'No token provided, authorization denied.' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Lấy user và loại trừ trường password
        const user = await User.findByPk(decoded.id, {
            attributes: { exclude: ['password'] }
        });

        if (!user) {
            return res.status(401).json({ message: 'User not found, authorization denied.' });
        }

        if (!user.isActive) {
            return res.status(401).json({ message: 'User account is deactivated, authorization denied.' });
        }

        req.user = user; // Gán user vào request để các route handler sau có thể sử dụng
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid token.' });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired.' });
        }
        // Ghi log lỗi ở server để debug
        console.error('Token verification error:', error);
        res.status(500).json({ message: 'Internal server error during token verification.' });
    }
};

const isAdmin = (req, res, next) => {
    // Middleware này phải chạy SAU verifyToken, vì nó cần req.user
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        // Nếu không phải admin, trả về lỗi 403 Forbidden
        res.status(403).json({ message: 'Access denied. Admin role required.' });
    }
};

module.exports = {
    verifyToken,
    isAdmin
};
