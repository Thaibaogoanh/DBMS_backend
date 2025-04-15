const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config'); // Đảm bảo đường dẫn đúng đến file cấu hình sequelize

const ProductReview = sequelize.define('ProductReview', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true, // Tự động tăng
  },
  phone_number: {
    type: DataTypes.STRING(15),
    allowNull: false,
    references: {
      model: 'Users',  // Tên bảng liên kết với bảng Users
      key: 'phone_number',
    },
    onDelete: 'CASCADE',
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Products', // Tên bảng liên kết với bảng Products
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5,
    },
  },
  review_text: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  review_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  image_url: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
}, {
  tableName: 'ProductReviews',  // Đảm bảo tên bảng trong cơ sở dữ liệu
  timestamps: false,  // Nếu bạn không muốn Sequelize tự động quản lý các trường createdAt và updatedAt
});

module.exports = ProductReview;
