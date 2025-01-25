const express = require('express');
const sequelize = require('./config/db');
const HealthCheck = require('./models/healthCheck');

const app = express();
const PORT = 8080;

// Middleware to enforce JSON-only requests
app.use(express.json());

// Middleware for cache-control
app.use((req, res, next) => {
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.set('Pragma', 'no-cache');
    next();
});

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
        console.error('Database error:', err);
        return res.status(503).send(); // Service Unavailable
    }
});

// Handle unsupported methods
app.all('/healthz', (req, res) => {
    return res.status(405).send(); // Method Not Allowed
});


// Start the server
app.listen(PORT, async () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    try {
        await sequelize.authenticate();
        console.log('Database connected successfully.');
        await sequelize.sync(); // Sync models to DB
    } catch (err) {
        console.error('Database connection failed:', err);
    }
});
