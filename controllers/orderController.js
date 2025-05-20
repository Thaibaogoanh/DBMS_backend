// controllers/orderController.js
const { Order, OrderItem, Product, User, sequelize } = require('../models'); // Import sequelize cho transaction và User

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res, next) => {
    const transaction = await sequelize.transaction(); // Bắt đầu transaction
    try {
        const {
            items, // Mảng các sản phẩm: [{ productId, quantity, price (giá tại thời điểm mua) }]
            shippingAddress,
            paymentMethod,
            // totalAmount nên được tính toán ở backend dựa trên items và price để đảm bảo chính xác
        } = req.body;
        const userId = req.user.id; // Lấy từ middleware verifyToken

        if (!items || items.length === 0) {
            await transaction.rollback(); // Rollback nếu không có items
            return res.status(400).json({ message: 'No order items provided.' });
        }

        // Kiểm tra và tính toán tổng tiền
        let calculatedTotalAmount = 0;
        for (const item of items) {
            const product = await Product.findByPk(item.productId, { transaction });
            if (!product) {
                await transaction.rollback();
                return res.status(404).json({ message: `Product with ID ${item.productId} not found.` });
            }
            if (product.stock < item.quantity) { // Sử dụng 'stock' từ model Product.js
                await transaction.rollback();
                return res.status(400).json({ message: `Not enough stock for product ${product.name}. Available: ${product.stock}` });
            }
            // Sử dụng giá từ client gửi lên (giá tại thời điểm mua) hoặc lấy giá mới nhất từ DB (tùy logic kinh doanh)
            // Ở đây giả sử client gửi giá chính xác tại thời điểm đặt hàng
            if (typeof item.price !== 'number' || item.price < 0) {
                await transaction.rollback();
                return res.status(400).json({ message: `Invalid price for product ${product.name}.` });
            }
            calculatedTotalAmount += item.quantity * item.price;
        }


        // Tạo Order
        const order = await Order.create({
            userId, // Tên thuộc tính trong model Order là 'userId'
            totalAmount: calculatedTotalAmount, // Sử dụng tổng tiền đã tính toán
            shippingAddress,
            paymentMethod,
            status: 'pending', // Trạng thái mặc định
            paymentStatus: 'pending' // Trạng thái thanh toán mặc định
        }, { transaction });

        // Tạo OrderItems và cập nhật số lượng sản phẩm
        const orderItemsData = [];
        for (const item of items) {
            orderItemsData.push({
                orderId: order.id,     // Tên thuộc tính trong model OrderItem là 'orderId'
                productId: item.productId, // Tên thuộc tính trong model OrderItem là 'productId'
                quantity: item.quantity,
                price: item.price, // Giá tại thời điểm mua
                // subtotal có thể được tính ở đây hoặc bỏ qua nếu không cần thiết trong DB
                subtotal: item.quantity * item.price
            });

            const product = await Product.findByPk(item.productId, { transaction });
            // product.quantity -= item.quantity; // Nếu model Product dùng 'quantity' cho tồn kho
            product.stock -= item.quantity; // Nếu model Product dùng 'stock' cho tồn kho
            await product.save({ transaction });
        }

        await OrderItem.bulkCreate(orderItemsData, { transaction });

        await transaction.commit(); // Commit transaction nếu tất cả thành công

        // Lấy lại thông tin order đã tạo với các mục chi tiết
        const createdOrder = await Order.findByPk(order.id, {
            include: [
                {
                    model: User, // Bao gồm thông tin người dùng (loại trừ mật khẩu)
                    as: 'user',
                    attributes: { exclude: ['password'] }
                },
                {
                    model: OrderItem,
                    as: 'items',
                    include: [{
                        model: Product,
                        as: 'product',
                        attributes: ['id', 'name', 'image'] // Chỉ lấy các trường cần thiết của Product
                    }]
                }
            ]
        });

        res.status(201).json(createdOrder);

    } catch (error) {
        if (transaction) await transaction.rollback(); // Rollback nếu có lỗi xảy ra
        console.error('Error creating order:', error);
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({ message: error.errors.map(e => e.message).join(', ') });
        }
        res.status(500).json({ message: 'Error creating order.', error: error.message });
        // Hoặc: next(error);
    }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res, next) => {
    try {
        const order = await Order.findByPk(req.params.id, {
            include: [
                {
                    model: User, // Bao gồm thông tin người dùng
                    as: 'user',
                    attributes: { exclude: ['password'] }
                },
                {
                    model: OrderItem,
                    as: 'items', // Đảm bảo alias này khớp với định nghĩa trong model Order
                    include: [{
                        model: Product,
                        as: 'product', // Đảm bảo alias này khớp với định nghĩa trong model OrderItem
                        attributes: ['id', 'name', 'image', 'price'] // Thêm price của product nếu cần
                    }]
                }
            ]
        });

        if (!order) {
            return res.status(404).json({ message: 'Order not found.' });
        }

        // Kiểm tra quyền: user sở hữu order hoặc là admin
        if (order.userId !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to access this order.' });
        }

        res.json(order);
    } catch (error) {
        console.error('Error fetching order by ID:', error);
        res.status(500).json({ message: 'Error fetching order.', error: error.message });
        // Hoặc: next(error);
    }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res, next) => {
    try {
        const orders = await Order.findAll({
            where: { userId: req.user.id }, // Tên thuộc tính trong model Order là 'userId'
            include: [
                // Không nhất thiết phải include User ở đây vì đã lọc theo userId
                {
                    model: OrderItem,
                    as: 'items',
                    include: [{
                        model: Product,
                        as: 'product',
                        attributes: ['id', 'name', 'image']
                    }]
                }
            ],
            order: [['createdAt', 'DESC']] // Sắp xếp đơn hàng mới nhất lên đầu
        });
        res.json(orders);
    } catch (error) {
        console.error('Error fetching user orders:', error);
        res.status(500).json({ message: 'Error fetching orders.', error: error.message });
        // Hoặc: next(error);
    }
};

// @desc    Get all orders (Admin only)
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res, next) => {
    // Middleware isAdmin nên được áp dụng cho route này
    try {
        const orders = await Order.findAll({
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'name', 'email'] // Lấy thông tin cơ bản của user đặt hàng
                },
                {
                    model: OrderItem,
                    as: 'items',
                    include: [{
                        model: Product,
                        as: 'product',
                        attributes: ['id', 'name']
                    }]
                }
            ],
            order: [['createdAt', 'DESC']]
        });
        res.json(orders);
    } catch (error) {
        console.error('Error fetching all orders:', error);
        res.status(500).json({ message: 'Error fetching all orders.', error: error.message });
        // Hoặc: next(error);
    }
};

// @desc    Update order to delivered (Admin only)
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = async (req, res, next) => {
    // Middleware isAdmin nên được áp dụng
    try {
        const order = await Order.findByPk(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found.' });
        }

        order.status = 'delivered';
        order.paymentStatus = 'completed'; // Có thể cập nhật cả paymentStatus nếu hợp lý
        // order.deliveredAt = new Date(); // Nếu có trường deliveredAt
        
        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } catch (error) {
        console.error('Error updating order to delivered:', error);
        res.status(500).json({ message: 'Error updating order.', error: error.message });
        // Hoặc: next(error);
    }
};

// Thêm hàm cập nhật trạng thái đơn hàng chung (cho admin)
const updateOrderStatus = async (req, res, next) => {
    try {
        const { status } = req.body; // Ví dụ: 'processing', 'shipped', 'cancelled'
        const order = await Order.findByPk(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found.' });
        }

        // Thêm validation cho giá trị status nếu cần
        const allowedStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ message: `Invalid status. Allowed statuses are: ${allowedStatuses.join(', ')}` });
        }

        order.status = status;
        // Nếu cancelled, có thể cần logic hoàn trả sản phẩm vào kho
        if (status === 'cancelled' && order.status !== 'delivered' /* và các điều kiện khác */) {
            // Logic hoàn trả sản phẩm (cần transaction)
            const transaction = await sequelize.transaction();
            try {
                for (const item of await order.getItems()) { // Giả sử getItems() là hàm lấy OrderItems
                    const product = await Product.findByPk(item.productId, { transaction });
                    if (product) {
                        product.stock += item.quantity;
                        await product.save({ transaction });
                    }
                }
                await transaction.commit();
            } catch (err) {
                await transaction.rollback();
                console.error('Error reverting stock on order cancellation:', err);
                // Không chặn việc hủy đơn hàng, nhưng ghi log lỗi
            }
        }


        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ message: 'Error updating order status.', error: error.message });
    }
};


module.exports = {
    createOrder,
    getOrderById,
    getMyOrders,
    getOrders,
    updateOrderToDelivered,
    updateOrderStatus // Export hàm mới
};
