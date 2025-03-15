const { Sequelize } = require('sequelize');
const mysql = require('mysql2/promise'); // Use promise-based MySQL for database management
require('dotenv').config();

// Load database credentials from environment variables
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    
  });

  const checkDbConnection = async () => {
    try {
        await sequelize.authenticate();
        logger.info('Connected to database successfully');
        console.log('Connected to database successfully');
        return true;
    } catch (error) {
        logger.error('Connection to database failed:', { error });
        console.error('Connection to database failed:', error);
        return false;
    }
};
  

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
     sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
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
module.exports = {checkDbConnection,initializeSequelize};
