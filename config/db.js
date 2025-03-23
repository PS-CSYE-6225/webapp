const { Sequelize } = require("sequelize");
const { logger } = require("../logger"); // Import Winston logger
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
        logger.info("Attempting to connect to the database...");

        await sequelize.authenticate(); // Correct usage of Sequelize authentication
        logger.info(`Database '${DB_NAME}' connected successfully.`);
        

        await sequelize.sync({ alter: true }); // Ensures the schema matches models without dropping data
        logger.info("All models synchronized successfully.");
        //console.log("ImagetoS3 table is ready.");

        return sequelize;
    } catch (error) {
        logger.error("Database connection failed:", { error: error.message });
        console.error("Database connection failed:", error);
        process.exit(1);
    }
};

module.exports = { sequelize, initializeDatabase };
