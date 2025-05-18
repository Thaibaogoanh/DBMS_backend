const express = require('express');
const router = express.Router();
const {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');

// @route   POST /api/users/register
router.post('/users/register', registerUser);

// @route   POST /api/users/login
router.post('/users/login', loginUser);

// @route   GET /api/users/profile
router.get('/users/profile', protect, getUserProfile);

// @route   PUT /api/users/profile
router.put('/users/profile', protect, updateUserProfile);

module.exports = router; 