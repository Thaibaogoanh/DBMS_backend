// seeders/seedPostgres.js
const getSampleData = require('../data/sampleData');
const { User, Category, Product, Review, Order, OrderItem, sequelize } = require('../models');

const seedPostgresDatabase = async (force = false) => {
    try {
        if (force) {
            console.log('PostgreSQL: Forcing database sync - dropping all tables...');
            await sequelize.sync({ force: true });
            console.log('PostgreSQL: Database synchronized and wiped.');
        } else {
            const adminUser = await User.findOne({ where: { email: 'admin@example.com' } });
            if (adminUser) {
                console.log('PostgreSQL: Admin user already exists. Checking for first sample product...');
                const sampleProductsData = (await getSampleData()).products; // Gọi một lần để lấy dữ liệu
                if (sampleProductsData && sampleProductsData.length > 0 && sampleProductsData[0].id) {
                    const firstSampleProduct = await Product.findByPk(sampleProductsData[0].id);
                    if (firstSampleProduct) {
                        console.log(`PostgreSQL: First sample product (ID: ${sampleProductsData[0].id}) also exists. Seeding will be skipped unless forced.`);
                        return;
                    }
                }
            }
            console.log('PostgreSQL: No admin user or first sample product found, proceeding with seeding...');
        }

        // Gọi getSampleData MỘT LẦN DUY NHẤT ở đầu để đảm bảo ID nhất quán trong suốt quá trình seeding này
        const sample = await getSampleData();
        const { users, categories, products, reviews, orders, orderItems } = sample;

        console.log('PostgreSQL: Seeding Users...');
        // Log ID của user mẫu đầu tiên
        if (users.length > 0) console.log(`PostgreSQL: Sample User 1 ID for seeding: ${users[0].id}`);
        await User.bulkCreate(users, { validate: true, ignoreDuplicates: true });
        console.log('PostgreSQL: Users seeded.');
        // Kiểm tra lại User đã tạo
        if (users.length > 0) {
            const createdAdmin = await User.findByPk(users[0].id);
            console.log(`PostgreSQL: Admin User in DB after seeding - ID: ${createdAdmin?.id}, Email: ${createdAdmin?.email}`);
        }


        console.log('PostgreSQL: Seeding Categories...');
        if (categories.length > 0) console.log(`PostgreSQL: Sample Category 1 ID for seeding: ${categories[0].id}`);
        await Category.bulkCreate(categories, { validate: true, ignoreDuplicates: true });
        console.log('PostgreSQL: Categories seeded.');


        console.log('PostgreSQL: Preparing products for seeding (using fixed IDs from sampleData)...');
        const productsToCreate = products.map(p => {
            if (!p.id) { // Kiểm tra này vẫn quan trọng
                console.warn(`PostgreSQL Seeding: Product with title "${p.title}" is missing an ID in sampleData!`);
            }
            console.log(`PostgreSQL: Preparing product with PREDEFINED ID: ${p.id}, Title: ${p.title}`);
            return { // Đảm bảo tất cả các trường cần thiết cho Product model đều có ở đây
                id: p.id,
                name: p.name,
                title: p.title,
                description: p.description,
                price: p.price,
                oldPrice: p.oldPrice,
                stock: p.stock,
                quantity: p.quantity !== undefined ? p.quantity : p.stock,
                image: p.image,
                images: p.images,
                categoryId: p.categoryId, // ID này cũng phải cố định từ sampleData
                isActive: p.isActive !== undefined ? p.isActive : true,
                averageRating: p.averageRating !== undefined ? p.averageRating : 0,
                numReviews: p.numReviews !== undefined ? p.numReviews : 0,
                isNew: p.isNew !== undefined ? p.isNew : false,
                isFeatured: p.isFeatured !== undefined ? p.isFeatured : false,
            };
        });
        await Product.bulkCreate(productsToCreate, { validate: true, ignoreDuplicates: true });
        console.log('PostgreSQL: Products seeded.');

        // KIỂM TRA ID SẢN PHẨM SAU KHI SEED
        console.log('PostgreSQL: Verifying product IDs in DB after seeding...');
        for (const sampleProduct of products) {
            const createdProduct = await Product.findByPk(sampleProduct.id);
            if (createdProduct) {
                console.log(`PostgreSQL: Product Title: "${sampleProduct.title}", Sample ID: ${sampleProduct.id}, DB ID: ${createdProduct.id} -> ${sampleProduct.id === createdProduct.id ? 'MATCH!' : 'MISMATCH!'}`);
                if (sampleProduct.id !== createdProduct.id) {
                    console.error(`CRITICAL ID MISMATCH for product: ${sampleProduct.title}. Sequelize might be ignoring provided IDs.`);
                }
            } else {
                console.warn(`PostgreSQL: Product with sample ID ${sampleProduct.id} (Title: "${sampleProduct.title}") NOT FOUND in DB after seeding.`);
            }
        }

        // Seeding Reviews, Orders, OrderItems sẽ trực tiếp sử dụng ID từ sample.users, sample.products, sample.orders
        // vì chúng ta tin rằng các bước bulkCreate ở trên đã sử dụng đúng các ID đó.

        console.log('PostgreSQL: Seeding Reviews...');
        // Đảm bảo review.userId và review.productId là các ID cố định từ sampleData
        const reviewsToCreate = reviews.map(review => ({
            id: review.id, // Nếu review cũng có ID cố định
            userId: review.userId,
            productId: review.productId,
            rating: review.rating,
            comment: review.comment,
            isActive: review.isActive !== undefined ? review.isActive : true,
            isVerified: review.isVerified !== undefined ? review.isVerified : false,
        }));
        await Review.bulkCreate(reviewsToCreate, { validate: true, ignoreDuplicates: true });
        console.log('PostgreSQL: Reviews seeded.');

        console.log('PostgreSQL: Updating product ratings...');
        const allCreatedProducts = await Product.findAll(); // Lấy tất cả sản phẩm từ DB
        for (const product of allCreatedProducts) {
            const productReviews = await Review.findAll({ where: { productId: product.id, isActive: true } });
            const totalRating = productReviews.reduce((acc, rev) => acc + rev.rating, 0);
            const numReviews = productReviews.length;
            const averageRating = numReviews > 0 ? parseFloat((totalRating / numReviews).toFixed(2)) : 0;

            await Product.update(
                { numReviews: numReviews, averageRating: averageRating },
                { where: { id: product.id } }
            );
        }
        console.log('PostgreSQL: Product ratings updated.');

        console.log('PostgreSQL: Seeding Orders...');
        // Đảm bảo order.userId là ID cố định từ sampleData
        await Order.bulkCreate(orders, { validate: true, ignoreDuplicates: true });
        console.log('PostgreSQL: Orders seeded.');

        console.log('PostgreSQL: Seeding OrderItems...');
        // Đảm bảo item.orderId và item.productId là ID cố định từ sampleData
        await OrderItem.bulkCreate(orderItems, { validate: true, ignoreDuplicates: true });
        console.log('PostgreSQL: OrderItems seeded.');

        console.log('PostgreSQL: Updating product stock based on sample orders...');
        for (const item of orderItems) { // Dùng orderItems từ sampleData
            const product = await Product.findByPk(item.productId); // item.productId là ID cố định
            if (product) {
                const newStock = (product.stock || 0) - item.quantity;
                await product.update({ stock: newStock < 0 ? 0 : newStock });
            }
        }
        console.log('PostgreSQL: Product stock updated.');

        console.log('PostgreSQL: Database seeding completed successfully.');

    } catch (error) {
        console.error('PostgreSQL: Error seeding database:', error);
        throw error;
    }
};

module.exports = seedPostgresDatabase;