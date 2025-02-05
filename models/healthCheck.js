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
    }, {
        timestamps: false 
    });

    await HealthCheck.sync({ alter: true }); // Ensure table is ready
    console.log("HealthCheck table is ready.");

    return HealthCheck;
};
