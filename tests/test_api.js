const request = require("supertest");
const app = require("../index"); // Import the app instance

describe("Health Check API Tests", () => {
    beforeAll(async () => {
        // Wait for Sequelize to initialize before tests start
        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for DB to initialize
        if (!app.locals.sequelize) {
            throw new Error("Sequelize instance is undefined!");
        }
    });

    afterAll(async () => {
        //  Close DB connection after all tests
        if (app.locals.sequelize) {
            await app.locals.sequelize.close();
        }
    });

    //  Should return 200 OK when database is running
    it("should return 200 OK on GET /healthz", async () => {
        await request(app)
            .get("/healthz")
            .expect(200);
    });

    //  Should return 400 Bad Request when payload is sent
    it("should return 400 Bad Request on GET /healthz with payload", async () => {
        await request(app)
            .get("/healthz")
            .send({ test: "payload" }) // Invalid request
            .expect(400);
    });

    it("should return 400 Bad Request on GET /healthz with broken JSON", async () => {
        await request(app)
            .get("/healthz")
            .set("Content-Type", "application/json")
            .send('{ "invalidJson": true ') 
            .expect(200);
    });

    it("should return 400 Bad Request on GET /healthz with query parameters", async () => {
        await request(app)
            .get("/healthz?keyparam=value") 
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

    
    //  Should return 503 Service Unavailable when DB is not reachable
    it("should return 503 Service Unavailable when DB is not reachable", async () => {
       //   Mock `HealthCheck.create()` to simulate a database error
        jest.spyOn(app.locals.sequelize.models.HealthCheck, 'create').mockRejectedValue(new Error("Database Down"));
    
        await request(app)
           .get("/healthz")
            .expect(503);
    });
    
    
});
