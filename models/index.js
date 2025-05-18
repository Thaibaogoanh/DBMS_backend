const User = require('./User');
const Product = require('./Product');
const Order = require('./Order');
const OrderItem = require('./OrderItem');
const Review = require('./Review');

// User - Order relationship
User.hasMany(Order);
Order.belongsTo(User);

// Product - Review relationship
Product.hasMany(Review);
Review.belongsTo(Product);

// User - Review relationship
User.hasMany(Review);
Review.belongsTo(User);

// Order - Product relationship (through OrderItem)
Order.belongsToMany(Product, { through: OrderItem });
Product.belongsToMany(Order, { through: OrderItem });

module.exports = {
    User,
    Product,
    Order,
    OrderItem,
    Review
}; 