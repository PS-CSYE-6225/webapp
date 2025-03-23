const { DataTypes } = require('sequelize');
const { logger } = require("../logger"); // Import Winston logger
const statsdClient = require("../metrics"); // Import StatsD client

module.exports = async (sequelize) => {
    try {
        statsdClient.increment("db.healthCheckModel.init"); // Track model initialization
        logger.info("Initializing HealthCheck model...");

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

        const startTime = Date.now();
        await HealthCheck.sync({ alter: true }); // Ensure table is ready
        statsdClient.timing("db.healthCheckModel.sync.time", Date.now() - startTime); // Track DB sync time

        logger.info("HealthCheck table is ready.");
    

        return HealthCheck;
    } catch (error) {
        statsdClient.increment("db.healthCheckModel.error"); // Increment error count
        logger.error(" HealthCheck table initialization failed:", { error: error.message });
        throw error;
    }
};
