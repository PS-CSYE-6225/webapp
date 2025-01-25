const { DataTypes, Sequelize } = require('sequelize'); // Import Sequelize
const sequelize = require('../config/db'); // Import your Sequelize instance

const HealthCheck = sequelize.define('HealthCheck', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    datetime: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW, // Use Sequelize.NOW for default date-time
    },
});

module.exports = HealthCheck;
