const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/review.controller');

router.post('/reviews', reviewController.createReview);

module.exports = router;
