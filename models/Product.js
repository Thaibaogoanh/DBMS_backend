const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');


const Product = sequelize.define('Product', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  imageUrl: {
    type: DataTypes.STRING,
  },
},{
  tableName: 'Products', // Đảm bảo Sequelize tìm đúng bảng với tên 'products'
  timestamps: true,
});

module.exports = Product;
