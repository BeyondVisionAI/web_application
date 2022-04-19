const app = require("../general/server");
const supertest = require("supertest");
const request = supertest(app);
const DBManager = require("../general/dbManager");
const mongoose = require("mongoose");
const databaseName = `${process.env.TESTS_DB_USER}`;
const Helper = require("../general/helper");

const { Errors } = require("../../Models/Errors");
const { User } = require("../../Models/User");

// Setup //

beforeAll(async () => {
    const url = `${DBManager.databaseURL}/${databaseName}`;
    await DBManager.openMongooseConnection(mongoose, url);
});

afterEach(async () => {
    await DBManager.removeAllCollections(mongoose);
});

afterAll(async () => {
    await DBManager.closeMongooseConnection(mongoose);
});


// Tests //

describe("Register a user", () => {
    it("Should register the user", async () => {
        const res = await request.post("/user/register")
        .send({firstName: "toto",
            lastName: "tata",
            email: "toto@tata.com",
            password: "toto1234"});
        expect(res.status).toBe(200);
        expect(res.text).toBe("Success");
        const dbContent = await User.find();
        expect(dbContent.length).toBe(1);
        expect(dbContent[0]).toEqual(expect.objectContaining({
            email: "toto@tata.com",
            firstName: "toto",
            lastName: "tata",
            isEmailConfirmed: false,
            password: expect.any(String),
            verificationUID: expect.any(String)
        }));
    });

    it("Should fail because missing firstName", async () => {
        const res = await request.post("/user/register")
        .send({lastName: "tata",
            email: "toto@tata.com",
            password: "toto1234"});
        expect(res.status).toBe(400);
        expect(res.text).toBe(Errors.BAD_REQUEST_MISSING_INFOS);
        const dbContent = await User.find();
        expect(dbContent.length).toBe(0);
    });

    it("Should fail because missing lastName", async () => {
        const res = await request.post("/user/register")
        .send({firstName: "toto",
            email: "toto@tata.com",
            password: "toto1234"});
        expect(res.status).toBe(400);
        expect(res.text).toBe(Errors.BAD_REQUEST_MISSING_INFOS);
        const dbContent = await User.find();
        expect(dbContent.length).toBe(0);
    });

    it("Should fail because missing email", async () => {
        const res = await request.post("/user/register")
        .send({firstName: "toto",
            lastName: "tata",
            password: "toto1234"});
        expect(res.status).toBe(400);
        expect(res.text).toBe(Errors.BAD_REQUEST_MISSING_INFOS);
        const dbContent = await User.find();
        expect(dbContent.length).toBe(0);
    });

    it("Should fail because missing password", async () => {
        const res = await request.post("/user/register")
        .send({firstName: "toto",
            lastName: "tata",
            email: "toto@tata.com"});
        expect(res.status).toBe(400);
        expect(res.text).toBe(Errors.BAD_REQUEST_MISSING_INFOS);
        const dbContent = await User.find();
        expect(dbContent.length).toBe(0);
    });

    it("Should fail because email already in use", async () => {
        const user = {
            email: "toto@tata.com",
            firstName: "titi",
            lastName: "titi",
            isEmailConfirmed: false,
            password: "stringrandom",
            verificationUID: "stringrandom"
        };
        await new User(user).save();
        const res = await request.post("/user/register")
        .send({firstName: "toto",
            lastName: "tata",
            email: "toto@tata.com",
            password: "toto1234"});
        expect(res.status).toBe(409);
        expect(res.text).toBe(Errors.EMAIL_ALREADY_USED);
        const dbContent = await User.find();
        expect(dbContent.length).toBe(1);
    });

    it("Should fail because user already logged in", async () => {
        await Helper.User.registerUser(request, "toto", "tata", "toto@tata.com", "toto1234");
        const log1 = await Helper.User.loginUser(request, "toto@tata.com", "toto1234");
        const cookies = log1.headers['set-cookie'].pop().split(';')[0];
        const res = await request.post("/user/register").set('Cookie', cookies)
        .send({firstName: "titi",
            lastName: "tutu",
            email: "titi@tutu.com",
            password: "tutu1234"});
        expect(res.status).toBe(401);
        expect(res.text).toBe(Errors.USER_ALREADY_LOGIN);
    });
});

describe("Login a user", () => {
    beforeEach(async () => {
        await Helper.User.registerUser(request, "toto", "tata", "toto@tata.com", "toto1234");
    });

    it("Should login the user", async () => {
        const res = await request.post("/user/login").send({
            email: "toto@tata.com",
            password: "toto1234"
        });
        const cookies = res.headers['set-cookie'].pop().split(';')[0];
        expect(res.status).toBe(200);
        expect(cookies).not.toBe("");

        const res2 = await request.get("/projects").set("Cookie", cookies);
        expect(res2.status).toBe(200);
    });

    it("Should fail because missing email", async () => {
        const res = await request.post("/user/login").send({
            password: "toto1234"
        });
        expect(res.status).toBe(400);
        expect(res.text).toBe(Errors.BAD_REQUEST_MISSING_INFOS);
    });

    it("Should fail because missing password", async () => {
        const res = await request.post("/user/login").send({
            email: "toto@tata.com"
        });
        expect(res.status).toBe(400);
        expect(res.text).toBe(Errors.BAD_REQUEST_MISSING_INFOS);
    });

    it("Should fail because unknown email", async () => {
        const res = await request.post("/user/login").send({
            email: "titi@tutu.com",
            password: "toto1234"
        });
        expect(res.status).toBe(404);
        expect(res.text).toBe(Errors.USER_NOT_FOUND);
    });

    it("Should fail because wrong password", async () => {
        const res = await request.post("/user/login").send({
            email: "toto@tata.com",
            password: "tata4567"
        });
        const cookies = res.headers['set-cookie'].pop().split(';')[0];
        expect(res.status).toBe(401);
        expect(res.text).toBe(Errors.INVALID_PASSWORD);
    });

    it("Should fail because user already logged in", async () => {
        const res = await request.post("/user/login").send({
            email: "toto@tata.com",
            password: "toto1234"
        });
        expect(res.status).toBe(200);
        const cookies = res.headers['set-cookie'].pop().split(';')[0];
        const res2 = await request.post("/user/login").set("Cookie", cookies).send({
            email: "toto@tata.com",
            password: "toto1234"
        });
        expect(res2.status).toBe(401);
        expect(res2.text).toBe(Errors.USER_ALREADY_LOGIN);
    });
});

describe("Log out a user", () => {
    beforeEach(async () => {
        await Helper.User.registerUser(request, "toto", "tata", "toto@tata.com", "toto1234");
    });

    it("Should logout the user", async () => {
        const log = await Helper.User.loginUser(request, "toto@tata.com", "toto1234");
        const cookies = log.headers['set-cookie'].pop().split(';')[0];
        const res = await request.post("/user/logout").set("Cookie", cookies);
        expect(res.status).toBe(200);
        expect(res.text).toBe("Logout");
    });

    it("Should fail because user isn't logged in", async () => {
        const res = await request.post("/user/logout");
        expect(res.status).toBe(401);
        expect(res.text).toBe(Errors.USER_NOT_LOGIN);
    });
});

describe("Get information about the user", () => {
    var cookies;
    beforeEach(async () => {
        const res = await Helper.User.registerAndLoginUser(request, "toto", "tata", "toto@tata.com", "toto1234");
        cookies = res.headers['set-cookie'].pop().split(';')[0];
    });

    it("Should give informations about the user", async () => {
        const res = await request.get("/user/me").set("Cookie", cookies);
        expect(res.status).toBe(200);
        expect(res.body).toEqual(expect.objectContaining({
            email: "toto@tata.com",
            firstName: "toto",
            lastName: "tata",
            userId: expect.any(String)
        }));
    });

    it("Should give informations about two users", async () => {
        const user1 = cookies;
        const userLog2 = await Helper.User.registerAndLoginUser(request, "titi", "tutu", "titi@tutu.com", "titi5678");
        const user2 = userLog2.headers['set-cookie'].pop().split(';')[0];

        const res = await request.get("/user/me").set("Cookie", user1);
        expect(res.status).toBe(200);
        expect(res.body).toEqual(expect.objectContaining({
            email: "toto@tata.com",
            firstName: "toto",
            lastName: "tata",
            userId: expect.any(String)
        }));

        const res2 = await request.get("/user/me").set("Cookie", user2);
        expect(res2.status).toBe(200);
        expect(res2.body).toEqual(expect.objectContaining({
            email: "titi@tutu.com",
            firstName: "titi",
            lastName: "tutu",
            userId: expect.any(String)
        }));
    });

    it("Should fail because user isn't logged in", async () => {
        const res = await request.get("/user/me");
        expect(res.status).toBe(401);
        expect(res.text).toBe(Errors.USER_NOT_LOGIN);
    });
});