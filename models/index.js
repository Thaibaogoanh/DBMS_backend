// models/index.js
const { Sequelize, DataTypes } = require('sequelize');
const dbConfig = require('../config/db.config.js'); // Điều chỉnh đường dẫn nếu thư mục config của bạn ở nơi khác

// --- GHI LOG CHI TIẾT cho mật khẩu ---
// console.log('--- PostgreSQL Connection Details (from models/index.js) ---');
// console.log('Attempting to use DB_PASSWORD from dbConfig:', dbConfig.PASSWORD);
// console.log('Type of DB_PASSWORD from dbConfig:', typeof dbConfig.PASSWORD);
// --- KẾT THÚC GHI LOG ---

// Khởi tạo Sequelize với cấu hình
const sequelize = new Sequelize(
    dbConfig.DB,
    dbConfig.USER,
    dbConfig.PASSWORD,
    {
        host: dbConfig.HOST,
        port: parseInt(dbConfig.PORT, 10),
        dialect: dbConfig.dialect,
        logging: process.env.NODE_ENV === 'development' ? console.log : false,
        pool: dbConfig.pool
    }
);

// Đối tượng để giữ tất cả các thuộc tính và model liên quan đến cơ sở dữ liệu
const db = {
    sequelize,
    Sequelize, // Chính thư viện Sequelize
    User: require('./User')(sequelize, DataTypes),
    Product: require('./Product')(sequelize, DataTypes),
    Category: require('./Category')(sequelize, DataTypes),
    Order: require('./Order')(sequelize, DataTypes),
    OrderItem: require('./OrderItem')(sequelize, DataTypes),
    Review: require('./Review')(sequelize, DataTypes),
    Cart: require('./Cart')(sequelize, DataTypes), // Gọi hàm export từ Cart.js
    CartItem: require('./CartItem')(sequelize, DataTypes) // Gọi hàm export từ CartItem.js
};

// Thiết lập các mối quan hệ model
Object.keys(db).forEach(modelName => {
    if (db[modelName] && db[modelName].associate) {
        db[modelName].associate(db);
    }
});

// Hàm trợ giúp để kiểm tra kết nối cơ sở dữ liệu
const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connection has been established successfully (from models/index.js).');
    } catch (error) {
        console.error('Unable to connect to the database (from models/index.js):', error.message);
        throw error;
    }
};

// Hàm trợ giúp để đồng bộ hóa cơ sở dữ liệu
const syncDatabase = async (force = false) => {
    try {
        await sequelize.sync({ force });
        console.log(`Database synchronized successfully. (Force: ${force}) (from models/index.js).`);
    } catch (error) {
        console.error('Error synchronizing database (from models/index.js):', error.message);
        // Ném lỗi gốc để app.js có thể bắt và xử lý chi tiết hơn nếu cần
        if (error.original) {
            console.error('Original error during sync:', error.original);
        }
        throw error;
    }
};

module.exports = {
    ...db,
    testConnection,
    syncDatabase
};
