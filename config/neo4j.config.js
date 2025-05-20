// config/neo4j.config.js
const neo4j = require('neo4j-driver');

let driver; // Biến driver sẽ được khởi tạo một lần và tái sử dụng

/**
 * Khởi tạo Neo4j driver.
 * Nên được gọi một lần khi ứng dụng khởi động.
 */
const initializeNeo4j = async () => {
    const uri = process.env.NEO4J_URI;
    const user = process.env.NEO4J_USER;
    const password = process.env.NEO4J_PASSWORD;

    if (!uri || !user || !password) {
        console.error('NEO4J_URI, NEO4J_USER, or NEO4J_PASSWORD không được định nghĩa trong file .env');
        // Quyết định xem có nên throw lỗi hay cho phép ứng dụng tiếp tục mà không có Neo4j
        // throw new Error('Neo4j credentials not configured.');
        return false; // Hoặc trả về false để app.js xử lý
    }

    try {
        driver = neo4j.driver(uri, neo4j.auth.basic(user, password), {
            // Các tùy chọn driver khác nếu cần, ví dụ:
            // maxConnectionLifetime: 3 * 60 * 60 * 1000, // 3 hours
            // maxConnectionPoolSize: 50,
            // connectionAcquisitionTimeout: 2 * 60 * 1000 // 2 minutes
        });
        await driver.verifyConnectivity(); // Kiểm tra kết nối tới server Neo4j
        console.log('Neo4j Driver đã được tạo và kết nối thành công.');
        return true;
    } catch (error) {
        console.error('Không thể tạo hoặc kết nối Neo4j driver:', error);
        driver = null; // Đảm bảo driver là null nếu kết nối thất bại
        // throw error; // Hoặc trả về false
        return false;
    }
};

/**
 * Lấy một session mới từ driver.
 * Người gọi hàm này chịu trách nhiệm đóng session sau khi sử dụng.
 * @param {string} database - Tên cơ sở dữ liệu Neo4j (tùy chọn, mặc định từ .env)
 * @returns {neo4j.Session} Một instance session mới.
 */
const getSession = (database = process.env.NEO4J_DATABASE) => {
    if (!driver) {
        console.error('Neo4j driver chưa được khởi tạo. Hãy gọi initializeNeo4j() trước.');
        // Đây là lỗi nghiêm trọng nếu getSession được gọi mà không có driver.
        throw new Error('Neo4j driver not initialized. Cannot create session.');
    }
    // Mỗi lần gọi getSession sẽ trả về một session MỚI.
    // Session này cần được đóng bởi hàm gọi nó.
    const sessionConfig = {};
    if (database) {
        sessionConfig.database = database;
    }
    return driver.session(sessionConfig);
};

/**
 * Đóng Neo4j driver.
 * Nên được gọi khi ứng dụng tắt (graceful shutdown).
 */
const closeNeo4j = async () => {
    if (driver) {
        try {
            await driver.close();
            console.log('Neo4j Driver đã được đóng.');
            driver = null;
        } catch (error) {
            console.error('Lỗi khi đóng Neo4j driver:', error);
        }
    }
};

module.exports = {
    initializeNeo4j,
    getSession,
    closeNeo4j,
    // Bạn có thể export driver nếu các phần khác của ứng dụng cần truy cập trực tiếp,
    // nhưng thường thì getSession được ưu tiên hơn.
    // getDriver: () => driver 
};
