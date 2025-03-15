const { Sequelize } = require("sequelize");
require("dotenv").config();

// Check if running in production (AWS EC2)
const isProduction = process.env.NODE_ENV === "production";

// Debugging: Print environment variables
console.log("DB_HOST:", isProduction ? process.env.PROD_DB_HOST : process.env.DB_HOST);


const sequelize = new Sequelize(
  isProduction ? process.env.PROD_DB_NAME : process.env.DB_NAME,
  isProduction ? process.env.PROD_DB_USER : process.env.DB_USER,
  isProduction ? process.env.PROD_DB_PASSWORD : process.env.DB_PASSWORD,
  {
    host: isProduction ? process.env.PROD_DB_HOST : process.env.DB_HOST,
    port: isProduction ? process.env.PROD_DB_PORT : process.env.DB_PORT || 3306,
    dialect: "mysql",
    logging: false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);


const testDBConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log(` Connected to ${isProduction ? "AWS RDS" : "MySQL"} successfully!`);
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
};

testDBConnection();

module.exports = sequelize;
