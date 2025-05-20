// routes/recommendation.routes.js
const express = require('express');
const router = express.Router();
const recommendationController = require('../controllers/recommendation.controller'); // Đảm bảo đường dẫn đúng
const { verifyToken } = require('../middleware/auth.middleware'); // Đảm bảo đường dẫn đúng

// Tất cả các route gợi ý đều yêu cầu xác thực người dùng
router.use(verifyToken);

// GET /api/recommendations/user-recommendations
router.get('/user-recommendations', recommendationController.getUserRecommendations);

// GET /api/recommendations/similar-products/:productId
router.get('/similar-products/:productId', recommendationController.getSimilarProducts);

// GET /api/recommendations/category-hierarchy
router.get('/category-hierarchy', recommendationController.getCategoryHierarchy);

// GET /api/recommendations/purchase-patterns
router.get('/purchase-patterns', recommendationController.getPurchasePatterns);

// GET /api/recommendations/frequently-bought/:productId
router.get('/frequently-bought/:productId', recommendationController.getFrequentlyBoughtTogether);

// POST /api/recommendations/record-purchase
router.post('/record-purchase', recommendationController.recordPurchase);

module.exports = router;
