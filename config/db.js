const { Sequelize } = require('sequelize');
const mysql = require('mysql2/promise'); // Use promise-based MySQL for database management
require('dotenv').config();

// Load database credentials from environment variables
const DB_HOST = process.env.DB_HOST;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME;
const DB_PORT = process.env.DB_PORT || 8080;

// Ensure database exists before starting Sequelize
const ensureDatabaseExists = async () => {
    try {
        const connection = await mysql.createConnection({
            host: DB_HOST,
            user: DB_USER,
            password: DB_PASSWORD,
            port: DB_PORT,
            charset: 'utf8mb4', //  Fix encoding issue
            
        });

        // Create database if it doesn't exist
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`;`);
        console.log(` Database '${DB_NAME}' is ready.`);
        await connection.end();
    } catch (err) {
        console.error('Database creation failed:', err);
        process.exit(1);
    }
};

// Create database if not exists, then initialize Sequelize
const initializeSequelize = async () => {
    await ensureDatabaseExists();

    // Connect Sequelize ORM to the database
    const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
        host: DB_HOST,
        dialect: 'mysql',
        port: DB_PORT,
        logging: false, // Disable logging for cleaner output
        dialectOptions: {
            charset: 'utf8mb4', // Fix encoding issue
        }
    });

    return sequelize;
};

// Export a Promise that resolves to Sequelize instance
module.exports = initializeSequelize;
