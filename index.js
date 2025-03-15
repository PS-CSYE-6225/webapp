require("dotenv").config(); // Load environment variables at the start

const express = require("express");
const sequelize = require("./config/db"); // Import Sequelize instance
const fileRoutes = require("./routes/fileRoutes"); // Import file upload routes

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use("/v1/file", fileRoutes);

// Health Check API
app.get("/healthz", async (req, res) => {
    try {
        await sequelize.authenticate(); // Check DB connection
        res.status(200).send();
    } catch (error) {
        console.error("Database connection failed:", error);
        res.status(503).send();
    }
});

// Catch-all for unsupported methods
app.all("*", (req, res) => {
    res.status(405).send({ error: "Method Not Allowed" });
});


const initializeApp = async () => {
    try {
        await sequelize.sync(); // Sync DB models
        console.log(" Database is ready!");

        // Start the server
        const PORT = process.env.PORT || 8080;
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

    } catch (err) {
        console.error("App initialization failed:", err);
        process.exit(1); // Stop execution if DB is not connected
    }
};

// Start the app
initializeApp();

module.exports = app; // Export for Jest testing
