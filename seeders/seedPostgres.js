// seeders/seedPostgres.js
const getSampleData = require('../data/sampleData'); // Đường dẫn đến file sampleData.js
const { User, Category, Product, Review, Order, OrderItem, sequelize } = require('../models'); // Import tất cả models và sequelize instance
const { v4: uuidv4 } = require('uuid');

const seedPostgresDatabase = async (force = false) => {
    try {
        if (force) {
            console.log('Forcing database sync for PostgreSQL - dropping all tables...');
            await sequelize.sync({ force: true }); // Xóa và tạo lại bảng
            console.log('PostgreSQL database synchronized and wiped.');
        } else {
            // Kiểm tra xem dữ liệu đã tồn tại chưa để tránh seeding lại không cần thiết
            const adminUser = await User.findOne({ where: { email: 'admin@example.com' } });
            if (adminUser) {
                console.log('Admin user already exists in PostgreSQL. Skipping seeding.');
                return;
            }
            console.log('No admin user found, proceeding with PostgreSQL seeding...');
        }

        const { users, categories, products: sampleProductsArray } = await getSampleData();

        console.log('Seeding Users for PostgreSQL...');
        await User.bulkCreate(users, { ignoreDuplicates: true });
        console.log('Users seeded.');

        console.log('Seeding Categories for PostgreSQL...');
        await Category.bulkCreate(categories, { ignoreDuplicates: true });
        console.log('Categories seeded.');

        console.log('Seeding Products for PostgreSQL...');
        await Product.bulkCreate(sampleProductsArray, { ignoreDuplicates: true });
        console.log('Products seeded.');

        // Lấy lại ID thực tế từ DB (quan trọng nếu DB tự tạo ID hoặc có thay đổi)
        const createdUsers = await User.findAll({ where: { email: users.map(u => u.email) } });
        const createdProducts = await Product.findAll({ where: { title: sampleProductsArray.map(p => p.title) } });
        
        if (createdUsers.length < 2 || createdProducts.length < 3) {
            console.warn('Not enough users or products found after seeding to create reviews and orders.');
            return;
        }

        // --- REVIEWS (Ví dụ) ---
        console.log('Seeding Reviews for PostgreSQL...');
        const reviewsData = [
            { userId: createdUsers[1].id, productId: createdProducts[0].id, rating: 5, comment: 'Sản phẩm tuyệt vời, rất đáng tiền!', isActive: true, isVerified: true },
            { userId: createdUsers[2].id, productId: createdProducts[0].id, rating: 4, comment: 'Khá tốt, nhưng giá hơi cao một chút.', isActive: true },
            { userId: createdUsers[1].id, productId: createdProducts[2].id, rating: 5, comment: 'Điện thoại chụp ảnh siêu đẹp!', isActive: true, isVerified: true },
            { userId: createdUsers[2].id, productId: createdProducts[1].id, rating: 3, comment: 'Máy hơi nóng khi dùng lâu.', isActive: true },
        ];
        await Review.bulkCreate(reviewsData, { ignoreDuplicates: true });
        console.log('Reviews seeded.');

        // Cập nhật averageRating và numReviews cho Products
        for (const product of createdProducts) {
            const productReviews = await Review.findAll({ where: { productId: product.id, isActive: true } });
            const totalRating = productReviews.reduce((acc, review) => acc + review.rating, 0);
            product.numReviews = productReviews.length;
            product.averageRating = productReviews.length > 0 ? parseFloat((totalRating / productReviews.length).toFixed(2)) : 0;
            await product.save();
        }
        console.log('Product ratings updated.');


        // --- ORDERS & ORDER ITEMS (Ví dụ) ---
        console.log('Seeding Orders and OrderItems for PostgreSQL...');
        const order1Id = uuidv4();
        const order2Id = uuidv4();

        const ordersData = [
            { 
                id: order1Id, 
                userId: createdUsers[1].id, // Alice
                totalAmount: createdProducts[0].price * 1 + createdProducts[2].price * 1, 
                shippingAddress: createdUsers[1].address, 
                paymentMethod: 'COD', 
                status: 'delivered', 
                paymentStatus: 'completed' 
            },
            { 
                id: order2Id, 
                userId: createdUsers[2].id, // Bob
                totalAmount: createdProducts[1].price * 2, 
                shippingAddress: createdUsers[2].address, 
                paymentMethod: 'CreditCard', 
                status: 'processing', 
                paymentStatus: 'completed' 
            },
        ];
        await Order.bulkCreate(ordersData, { ignoreDuplicates: true });

        const orderItemsData = [
            // Order 1
            { orderId: order1Id, productId: createdProducts[0].id, quantity: 1, price: createdProducts[0].price, subtotal: createdProducts[0].price * 1 },
            { orderId: order1Id, productId: createdProducts[2].id, quantity: 1, price: createdProducts[2].price, subtotal: createdProducts[2].price * 1 },
            // Order 2
            { orderId: order2Id, productId: createdProducts[1].id, quantity: 2, price: createdProducts[1].price, subtotal: createdProducts[1].price * 2 },
        ];
        await OrderItem.bulkCreate(orderItemsData, { ignoreDuplicates: true });
        console.log('Orders and OrderItems seeded.');

        console.log('PostgreSQL database seeding completed successfully.');

    } catch (error) {
        console.error('Error seeding PostgreSQL database:', error);
    }
};

module.exports = seedPostgresDatabase;
