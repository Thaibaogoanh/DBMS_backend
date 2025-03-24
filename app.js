const express = require('express');
const cors = require('cors');
const productRoutes = require('./routes/product.routes');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', productRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to the Clothing Store API');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
