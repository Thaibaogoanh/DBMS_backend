// app.js
require('dotenv').config(); // Đảm bảo biến môi trường được nạp ngay từ đầu
const express = require('express');
const cors = require('cors');
const path = require('path'); // Thêm path nếu bạn cần phục vụ file tĩnh

// Import sequelize instance, testConnection, and syncDatabase từ models/index.js
const { sequelize, syncDatabase } = require('./models');

// Import Neo4j configuration and initialization function
// Giả sử neo4j.config.js export initializeNeo4j (để setup driver) và closeNeo4j (để đóng driver)
const { initializeNeo4j, closeNeo4j } = require('./config/neo4j.config'); 
// Import hàm seeding Neo4j
const { initializeAndSeedNeo4j } = require('./models/neo4j/schema'); 
// Import hàm seeding Postgres
const seedPostgresDatabase = require('./seeders/seedPostgres'); 

// Import route handlers
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/userRoutes'); // File: userRoutes.js
const productRoutes = require('./routes/productRoutes'); // File: productRoutes.js
const categoryRoutes = require('./routes/category.routes');
const orderRoutes = require('./routes/orderRoutes'); // File: orderRoutes.js
// const reviewRoutes = require('./routes/review.routes'); // Uncomment nếu bạn có và sử dụng
const recommendationRoutes = require('./routes/recommendation.routes');

// Import error handler middleware
const errorHandler = require('./middleware/errorHandler'); 

const app = express();

// Middleware setup
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// Phục vụ file tĩnh (ví dụ: ảnh upload) - nếu cần
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Main function to initialize the application
const initializeApp = async () => {
  try {
    // 1. Kết nối và xác thực PostgreSQL
    await sequelize.authenticate();
    console.log('PostgreSQL connection successful (from app.js).');

    // 2. Đồng bộ hóa cơ sở dữ liệu PostgreSQL
    const syncForce = process.env.NODE_ENV === 'development' && process.env.DB_FORCE_SYNC === 'true';
    await syncDatabase(syncForce);
    if (syncForce) {
        console.warn('PostgreSQL: Database synchronized with force: true. All data was dropped and recreated.');
    }

    // --- SEED POSTGRESQL DATABASE ---
    if (process.env.NODE_ENV === 'development' && process.env.SEED_DB === 'true') {
        console.log('Attempting to seed PostgreSQL database...');
        // Truyền syncForce để seedPostgresDatabase biết có cần xóa dữ liệu trước không nếu nó tự sync
        // Hoặc seedPostgresDatabase có thể có logic riêng để kiểm tra và seed
        await seedPostgresDatabase(syncForce); 
    }

    // 3. Khởi tạo kết nối Neo4j (Driver)
    await initializeNeo4j(); // Gọi hàm từ neo4j.config.js để thiết lập driver
    console.log('Neo4j driver initialized successfully.');

    // --- SEED NEO4J DATABASE (bao gồm tạo constraints) ---
    if (process.env.NODE_ENV === 'development' && process.env.SEED_DB === 'true') {
        console.log('Attempting to setup constraints and seed Neo4j database...');
        const neo4jForceSeed = process.env.NEO4J_FORCE_SEED === 'true';
        await initializeAndSeedNeo4j(neo4jForceSeed); // Gọi hàm từ models/neo4j/schema.js
    }
    
    // 4. Setup routes với tiền tố /api
    app.use('/api/auth', authRoutes);
    app.use('/api/users', userRoutes); 
    app.use('/api/products', productRoutes);
    app.use('/api/categories', categoryRoutes);
    app.use('/api/orders', orderRoutes);
    // app.use('/api/reviews', reviewRoutes); 
    app.use('/api/recommendations', recommendationRoutes);

    app.get('/api', (req, res) => {
        res.json({ message: 'Welcome to the Retail Web App API!' });
    });

    app.use('/api/*', (req, res) => {
        res.status(404).json({ message: 'API endpoint not found.' });
    });
    
    // 5. Middleware xử lý lỗi tập trung (phải đặt ở cuối cùng)
    app.use(errorHandler);

    // 6. Start the HTTP server
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode.`);
    });

  } catch (error) {
    console.error('Failed to initialize the application:', error.message);
    if (error.original) {
        console.error('Original error details:', error.original);
    } else {
        console.error('Full error object:', error);
    }
    await gracefulShutdown(); 
    process.exit(1);
  }
};

// Function để đóng các kết nối một cách duyên dáng
const gracefulShutdown = async (signal) => {
    if (signal) {
        console.log(`\nReceived ${signal}. Closing connections...`);
    }
    try {
        await sequelize.close();
        console.log('PostgreSQL connection closed.');
    } catch (err) {
        console.error('Error closing PostgreSQL connection:', err);
    }
    try {
        await closeNeo4j(); // Hàm này từ neo4j.config.js để đóng driver
        console.log('Neo4j connection closed.');
    } catch (err) {
        console.error('Error closing Neo4j connection:', err);
    }
    if (signal) {
      process.exit(0);
    }
};

// Bắt các tín hiệu để đóng ứng dụng
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('uncaughtException', async (error) => {
    console.error('UNCAUGHT EXCEPTION! Shutting down...', error);
    await gracefulShutdown();
    process.exit(1);
});
process.on('unhandledRejection', async (reason, promise) => {
    console.error('UNHANDLED REJECTION! Shutting down...', reason);
    await gracefulShutdown();
    process.exit(1);
});

// Start the application
initializeApp();

module.exports = app;
