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
            defaultValue: DataTypes.NOW,
        }
    });

    await HealthCheck.sync({ alter: true }); // Ensure table is ready
    console.log("HealthCheck table is ready.");

    return HealthCheck;
};
