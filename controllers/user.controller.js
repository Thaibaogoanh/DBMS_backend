const User = require('../models/User');
const ProductReview = require('../models/ProductReview');

const createUser = async (req, res) => {
  const { phone_number, username, full_name, email, password, birth_date, gender, is_seller, avatar_url } = req.body;

  try {
    const newUser = await User.create({
      phone_number,
      username,
      full_name,
      email,
      password,
      birth_date,
      gender,
      is_seller,
      avatar_url,
    });

    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
};

const getAllUsers = async (req, res) => {
    try {
      // Lấy tất cả người dùng từ cơ sở dữ liệu
      const users = await User.findAll();
  
      // Kiểm tra nếu không có người dùng nào
      if (users.length === 0) {
        return res.status(404).json({ message: 'No users found' });
      }
  
      // Trả về danh sách người dùng
      res.status(200).json({ users });
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
};

const getUserReviews = async (req, res) => {
  const { phone_number } = req.params;  // Lấy phone_number từ params trong URL

  try {
    // Kiểm tra xem người dùng có tồn tại không
    const user = await User.findOne({ where: { phone_number } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Lấy tất cả review của người dùng này
    const reviews = await ProductReview.findAll({
      where: { phone_number },
      order: [['review_date', 'DESC']], // Sắp xếp theo ngày đánh giá (tùy chọn)
    });

    // Kiểm tra nếu không có review nào
    if (reviews.length === 0) {
      return res.status(404).json({ message: 'No reviews found for this user' });
    }

    // Trả về danh sách các review của người dùng
    res.status(200).json({ phone_number, reviews });
  } catch (error) {
    console.error('Error fetching user reviews:', error);
    res.status(500).json({ message: 'Error fetching user reviews', error: error.message });
  }
};

module.exports = {
  createUser,
  getAllUsers,
  getUserReviews,
};
