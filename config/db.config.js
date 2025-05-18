// config/database.js (hoặc db.js)

const { Sequelize } = require('sequelize');

// Thay thế bằng thông tin kết nối PostgreSQL của bạn
const sequelize = new Sequelize('dbms', 'postgres', 'root123', {
  host: 'localhost', // Hoặc địa chỉ IP của PostgreSQL server
  dialect: 'postgres', // Quan trọng: Chỉ định đây là PostgreSQL
  port: 5432,          // Cổng mặc định của PostgreSQL
  logging: console.log, // Hiển thị các câu lệnh SQL được Sequelize thực thi (tắt bằng false hoặc bỏ đi trong production)

  // Cấu hình pool kết nối (tùy chọn, Sequelize có giá trị mặc định)
  pool: {
    max: 5, // Số kết nối tối đa trong pool
    min: 0, // Số kết nối tối thiểu trong pool
    acquire: 30000, // Thời gian tối đa (ms) để cố gắng lấy một kết nối trước khi báo lỗi
    idle: 10000 // Thời gian tối đa (ms) một kết nối có thể "nhàn rỗi" trước khi được giải phóng
  }
});

// Kiểm tra kết nối
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Kết nối Sequelize với PostgreSQL thành công!');
  } catch (error) {
    console.error('Không thể kết nối Sequelize với PostgreSQL:', error);
  }
}

testConnection();

module.exports = sequelize;