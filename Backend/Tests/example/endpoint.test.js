const app = require("../general/server"); // Link to your server file
const supertest = require("supertest");
const req = supertest(app);

it("Gets the test endpoint", async () => {
    // Sends GET Request to /test endpoint
    const res = await req.get("/test");
  
    expect(res.status).toBe(200);
    // ...
});