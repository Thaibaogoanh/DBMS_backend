// config/db.config.js
require('dotenv').config(); // Load environment variables from .env file

module.exports = {
  HOST: process.env.DB_HOST || "localhost",
  USER: process.env.DB_USER || "postgres",
  PASSWORD: process.env.DB_PASSWORD || "root123", // Uses .env password or fallback
  DB: process.env.DB_NAME || "dbms",
  PORT: process.env.DB_PORT || 5432,
  dialect: "postgres",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000, // milliseconds
    idle: 10000    // milliseconds
  }
};
