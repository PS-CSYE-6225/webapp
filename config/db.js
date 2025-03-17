const { Sequelize } = require("sequelize");
require("dotenv").config();

// Load database credentials from environment variables
const DB_HOST = process.env.DB_HOST;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME;
const DB_PORT = process.env.DB_PORT || 3306; // Default MySQL port

// Initialize Sequelize
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    dialect: "mysql",
    port: DB_PORT,
    logging: false, // Disable logging for cleaner output
    dialectOptions: {
        charset: "utf8mb4",
    },
});

// Function to sync models and ensure database connection
const initializeDatabase = async () => {
    try {
        await sequelize.authenticate(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`;`);
        console.log(` Database '${DB_NAME}' is ready.`);
        await sequelize.sync({ force: true }); 
        console.log("ImagetoS3 table is ready.");
        return sequelize;
    } catch (error) {
        console.error("Database connection failed:", error);
        process.exit(1);
    }
    
};

module.exports = { sequelize, initializeDatabase };
