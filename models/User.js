const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const User = sequelize.define('User', {
  phone_number: {
    type: DataTypes.STRING(15),
    primaryKey: true,
    allowNull: false,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  full_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  gender: {
    type: DataTypes.ENUM('Male', 'Female', 'Other'),
    allowNull: true,
  },
  is_seller: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  avatar_url: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: 'Users',  // Đảm bảo tên bảng
  timestamps: false,
});

module.exports = User;
