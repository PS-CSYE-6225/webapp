const express = require('express');
const initializeSequelize = require('./config/db'); // Import async Sequelize initialization
const loadHealthCheckModel = require('./models/healthCheck');

const app = express();
const PORT = 8080;

app.use(express.json());

// Initialize database and start server
(async () => {
    try {
        const sequelize = await initializeSequelize(); // Ensure DB is ready
        const HealthCheck = await loadHealthCheckModel(sequelize); // Load HealthCheck Model

        console.log('Database connected successfully.');

        // Health Check API - /healthz
        app.get('/healthz', async (req, res) => {
            try {
                // Ensure no payload is sent
                if (Object.keys(req.body).length > 0) {
                    return res.status(400).send(); // Bad Request
                }

                // Insert a new record in the health_check table
                await HealthCheck.create({});
                return res.status(200).send(); // Success
            } catch (err) {
                console.error(' Database error:', err);
                return res.status(503).send(); // Service Unavailable
            }
        });

        // Handle unsupported methods
        app.all('/healthz', (req, res) => {
            return res.status(405).send(); // Method Not Allowed
        });

        // Start the server
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error(' Server failed to start:', err);
        process.exit(1);
    }
})();
