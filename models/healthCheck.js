const { DataTypes } = require('sequelize');

module.exports = async (sequelize) => {
    const HealthCheck = sequelize.define('HealthCheck', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        datetime: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    });

    await HealthCheck.sync({ alter: true }); // Ensures the schema updates automatically
    console.log('HealthCheck table is ready.');
    return HealthCheck;
};
