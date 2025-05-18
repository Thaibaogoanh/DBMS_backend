const { Order, OrderItem, Product } = require('../models');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
    try {
        const {
            items,
            shippingAddress,
            paymentMethod,
            totalAmount
        } = req.body;

        if (items && items.length === 0) {
            return res.status(400).json({ message: 'No order items' });
        }

        const order = await Order.create({
            UserId: req.user.id,
            totalAmount,
            shippingAddress,
            paymentMethod
        });

        // Create order items
        const orderItems = items.map(item => ({
            OrderId: order.id,
            ProductId: item.productId,
            quantity: item.quantity,
            price: item.price
        }));

        await OrderItem.bulkCreate(orderItems);

        // Update product quantities
        for (const item of items) {
            const product = await Product.findByPk(item.productId);
            if (product) {
                product.quantity -= item.quantity;
                await product.save();
            }
        }

        const createdOrder = await Order.findByPk(order.id, {
            include: [{
                model: Product,
                through: OrderItem
            }]
        });

        res.status(201).json(createdOrder);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
    try {
        const order = await Order.findByPk(req.params.id, {
            include: [{
                model: Product,
                through: OrderItem
            }]
        });

        if (order) {
            if (order.UserId === req.user.id || req.user.role === 'admin') {
                res.json(order);
            } else {
                res.status(401).json({ message: 'Not authorized' });
            }
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.findAll({
            where: { UserId: req.user.id },
            include: [{
                model: Product,
                through: OrderItem
            }]
        });
        res.json(orders);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res) => {
    try {
        const orders = await Order.findAll({
            include: [{
                model: Product,
                through: OrderItem
            }]
        });
        res.json(orders);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = async (req, res) => {
    try {
        const order = await Order.findByPk(req.params.id);

        if (order) {
            order.status = 'delivered';
            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    createOrder,
    getOrderById,
    getMyOrders,
    getOrders,
    updateOrderToDelivered
}; 