const ProductReview = require('../models/ProductReview');
const User = require('../models/User');
const Product = require('../models/Product');

const createReview = async (req, res) => {
  const { phone_number, product_id, rating, review_text, image_url } = req.body;

  try {
    // Kiểm tra nếu người dùng và sản phẩm có tồn tại
    const user = await User.findOne({ where: { phone_number } });
    const product = await Product.findByPk(product_id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Tạo mới review
    const review = await ProductReview.create({
      phone_number,
      product_id,
      rating,
      review_text,
      image_url,
    });

    res.status(201).json({ message: 'Review created successfully', review });
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ message: 'Error creating review', error: error.message });
  }
};

module.exports = {
  createReview,
};
