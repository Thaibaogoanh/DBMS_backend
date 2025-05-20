// controllers/recommendation.controller.js
const neo4jQueries = require('../models/neo4j/queries'); // Giữ nguyên cách import này nếu nó đúng

// Get personalized recommendations for a user
const getUserRecommendations = async (req, res, next) => {
    try {
        const userId = req.user.id; // Đã có từ verifyToken
        if (!userId) { // Kiểm tra thêm nếu cần, dù verifyToken đã làm
            return res.status(400).json({ success: false, message: 'User ID is required.' });
        }
        const recommendations = await neo4jQueries.getUserRecommendations(userId);
        res.json({
            success: true,
            data: recommendations
        });
    } catch (error) {
        console.error('Error in getUserRecommendations controller:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching user recommendations.'
        });
        // Hoặc: next(error);
    }
};

// Get similar products
const getSimilarProducts = async (req, res, next) => {
    try {
        const { productId } = req.params;
        if (!productId) {
            return res.status(400).json({ success: false, message: 'Product ID is required.' });
        }
        const similarProducts = await neo4jQueries.getSimilarProducts(productId);
        res.json({
            success: true,
            data: similarProducts
        });
    } catch (error) {
        console.error('Error in getSimilarProducts controller:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching similar products.'
        });
        // Hoặc: next(error);
    }
};

// Get category hierarchy
const getCategoryHierarchy = async (req, res, next) => {
    try {
        const hierarchy = await neo4jQueries.getCategoryHierarchy();
        res.json({
            success: true,
            data: hierarchy
        });
    } catch (error) {
        console.error('Error in getCategoryHierarchy controller:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching category hierarchy.'
        });
        // Hoặc: next(error);
    }
};

// Get user purchase patterns
const getPurchasePatterns = async (req, res, next) => {
    try {
        const userId = req.user.id;
        if (!userId) {
            return res.status(400).json({ success: false, message: 'User ID is required.' });
        }
        const patterns = await neo4jQueries.getPurchasePatterns(userId);
        res.json({
            success: true,
            data: patterns
        });
    } catch (error) {
        console.error('Error in getPurchasePatterns controller:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching purchase patterns.'
        });
        // Hoặc: next(error);
    }
};

// Get frequently bought together products
const getFrequentlyBoughtTogether = async (req, res, next) => {
    try {
        const { productId } = req.params;
        if (!productId) {
            return res.status(400).json({ success: false, message: 'Product ID is required.' });
        }
        const products = await neo4jQueries.getFrequentlyBoughtTogether(productId);
        res.json({
            success: true,
            data: products
        });
    } catch (error) {
        console.error('Error in getFrequentlyBoughtTogether controller:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching frequently bought together products.'
        });
        // Hoặc: next(error);
    }
};

// Record a purchase relationship
const recordPurchase = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { productId } = req.body;

        if (!userId || !productId) {
            return res.status(400).json({ success: false, message: 'User ID and Product ID are required.' });
        }

        const success = await neo4jQueries.createPurchaseRelationship(userId, productId);
        if (success) {
            res.status(201).json({ // Sử dụng 201 Created nếu hợp lý
                success: true,
                message: 'Purchase recorded successfully.'
            });
        } else {
            // Hàm createPurchaseRelationship trả về false nếu có lỗi đã được xử lý bên trong nó
            // nhưng không phải là exception.
            res.status(400).json({ // Hoặc 500 tùy theo lỗi từ neo4jQueries
                success: false,
                message: 'Failed to record purchase. Please check logs in Neo4j queries.'
            });
        }
    } catch (error) {
        // Bắt các lỗi không mong muốn từ neo4jQueries.createPurchaseRelationship
        console.error('Error in recordPurchase controller:', error);
        res.status(500).json({
            success: false,
            message: 'Error recording purchase.'
        });
        // Hoặc: next(error);
    }
};

module.exports = {
    getUserRecommendations,
    getSimilarProducts,
    getCategoryHierarchy,
    getPurchasePatterns,
    getFrequentlyBoughtTogether,
    recordPurchase
};
