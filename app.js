const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db.config'); // import sequelize instance
const errorHandler = require('./middleware/errorHandler');
require('dotenv').config();

// Import routes
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', userRoutes);
app.use('/api', productRoutes);
app.use('/api', orderRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to the Retail Store API');
});

// Error handling middleware
app.use(errorHandler);

sequelize.sync({ alter: true })
  .then(() => {
    console.log('Database synced');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Error syncing database:', err);
  });
