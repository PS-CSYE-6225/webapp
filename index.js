const express = require('express');
const { initializeDatabase, sequelize } = require("./config/db");
const loadHealthCheckModel = require('./models/healthCheck');
const fileRoutes = require("./routes/fileRoutes");
const { logger } = require("./logger"); 
const app = express();
app.use(express.json({ strict: true }));

app.use("/v1/file", fileRoutes);

// Middleware for error handling & logging
app.use((err, req, res, next) => {
    logger.error(`Error: ${err.message}`, { stack: err.stack });

    res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.set('Pragma', 'no-cache');

    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).send(); // Return 400 Bad Request if JSON is malformed
    }
    next();
});

// Server Initialization with Logging
async function initializeApp() {
    try {
        logger.info("Initializing Database...");
        await initializeDatabase();
        await loadHealthCheckModel(sequelize);
        app.locals.sequelize = sequelize;
        logger.info("Database initialized successfully.");

        // Start the server only if this script is run directly
        if (require.main === module) {
            app.listen(8080, () => {
                logger.info("Server running on port 8080");
            });
        }
    } catch (err) {
        logger.error("Database initialization failed:", { error: err.message });
        process.exit(1);
    }
}

initializeApp(); // Initialize the app before Jest runs

// Health Check API - /healthz
app.get('/healthz', async (req, res) => {
    try {
        logger.info("Health check requested.");

        if (Object.keys(req.body).length > 0) {
            logger.warn("Health check failed: Request body not empty.");
            return res.status(400).send();
        }

        if (Object.keys(req.query).length > 0) {
            logger.warn("Health check failed: Query parameters present.");
            return res.status(400).send();
        }

        await app.locals.sequelize.models.HealthCheck.create({});
        logger.info("Health check successful.");
        return res.status(200).send();
    } catch (err) {
        logger.error("Health check failed:", { error: err.message });
        return res.status(503).send();
    }
});

// Handle unsupported methods with Logging
app.all('/healthz', (req, res) => {
    logger.warn(`Unsupported method ${req.method} attempted on /healthz`);
    return res.status(405).send();
});

module.exports = app; // Export Express App
