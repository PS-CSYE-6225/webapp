const express = require('express');
const initializeSequelize = require('./config/db'); // Database initialization
const loadHealthCheckModel = require('./models/healthCheck');

const app = express();
app.use(express.json());

app.use((req, res, next) => {
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.set('Pragma', 'no-cache');
    next();
});

async function initializeApp() {
    try {
        const sequelize = await initializeSequelize(); // Initialize database
        await loadHealthCheckModel(sequelize); // Load model
        app.locals.sequelize = sequelize; // Store Sequelize instance for tests

        console.log(" Database connected successfully.");

        // Start the server only if this script is run directly
        if (require.main === module) {
            app.listen(8080, () => {
                console.log("Server running on port 8080");
            });
        }
    } catch (err) {
        console.error(" Database initialization failed:", err);
        process.exit(1);
    }
}

initializeApp(); //  Initialize the app before Jest runs

// Health Check API - /healthz
app.get('/healthz', async (req, res) => {
    try {
        if (Object.keys(req.body).length > 0) {
            return res.status(400).send();
        }
        await app.locals.sequelize.models.HealthCheck.create({});
        return res.status(200).send();
    } catch (err) {
      //  console.error(" Database error:", err);
        return res.status(503).send();
    }
});

// Handle unsupported methods
app.all('/healthz', (req, res) => {
    return res.status(405).send();
});

module.exports = app; // Export Express App






