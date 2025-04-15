const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db.config'); // import sequelize instance
const productRoutes = require('./routes/product.routes');
const userRoutes = require('./routes/user.routes');
const reviewRoutes = require('./routes/review.routes')
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', productRoutes);
app.use('/api', userRoutes);
app.use('/api', reviewRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to the Clothing Store API');
});

sequelize.sync({}) // Chỉ nên dùng { force: true } khi bạn muốn tạo lại bảng (mất dữ liệu cũ)
  .then(() => {
    console.log('Database synced');
  })
  .catch((err) => {
    console.error('Error syncing database:', err);
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
