const { Pool } = require("pg");
require('dotenv').config();

const isProduction = process.env.NODE_ENV === 'production';
// console.log(isProduction)

const pool = new Pool({
    connectionString: isProduction
        ? process.env.DATABASE_URL // Use the DATABASE_URL for production
        : `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@localhost:5432/${process.env.DB_NAME}`, // Use local DB for development
    ssl: isProduction // Enforce SSL connection in production
        ? { rejectUnauthorized: false }
        : false
});

module.exports = pool;