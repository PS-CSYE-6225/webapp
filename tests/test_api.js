const request = require("supertest");
const app = require("../index"); // Import the app instance
const sequelize = require("../config/db");

describe("Health Check API Tests", () => {
    beforeAll(async () => {
        // Ensure Sequelize is initialized before tests start
        await sequelize.authenticate();
        console.log("Database connection successful for tests.");
    });

    afterAll(async () => {
        // Close DB connection after all tests
        await sequelize.close();
        console.log("Database connection closed after tests.");
    });

    //  Should return 200 OK when database is running
    it("should return 200 OK on GET /healthz", async () => {
        await request(app)
            .get("/healthz")
            .expect(200);
    });

    
    it("should return 400 Bad Request on GET /healthz with broken JSON", async () => {
        await request(app)
            .get("/healthz")
            .set("Content-Type", "application/json")
            .send('{ "invalidJson": true ') 
            .expect(400);
    });

    
    //  Should return 405 Method Not Allowed for non-GET requests
    const nonGetMethods = ["post", "put", "delete", "patch"];

    nonGetMethods.forEach((method) => {
        it(`should return 405 Method Not Allowed on ${method.toUpperCase()} /healthz`, async () => {
            await request(app)
                [method]("/healthz") 
                .expect(405);
        });

    });

    // ✅ Should return 503 Service Unavailable when DB is not reachable
    it("should return 503 Service Unavailable when DB is down", async () => {
        jest.spyOn(sequelize, "authenticate").mockRejectedValue(new Error("Database Down"));

        const res = await request(app).get("/healthz");
        expect(res.status).toBe(503);

        // Restore Sequelize's authenticate method after test
        sequelize.authenticate.mockRestore();
    });
});
    
    
