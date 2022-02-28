const app = require("../general/server");
const supertest = require("supertest");
const request = supertest(app);
const DBManager = require("../general/dbManager");
const mongoose = require("mongoose");
const databaseName = `${process.env.TESTS_DB_PROJECT}`;
const Helper = require("../general/helper");

const { Errors } = require("../../Models/Errors");
const { User } = require("../../Models/User");
const { Project } = require("../../Models/Project");
const { Collaboration } = require("../../Models/Collaboration");

// Variables //
const userA = { firstName: "toto", lastName: "toto", email: "toto@toto.com", password: "toto1234" };
const userB = { firstName: "tata", lastName: "tata", email: "tata@tata.com", password: "tata1234" };
const userC = { firstName: "titi", lastName: "titi", email: "titi@titi.com", password: "titi1234" };
var cookiesA;
var cookiesB;
var cookiesC;

// Setup //

beforeAll(async () => {
    const url = `${DBManager.databaseURL}/${databaseName}`;
    await DBManager.openMongooseConnection(mongoose, url);
});

beforeEach(async () => {
    var res;
    res = await Helper.User.registerAndLoginUser(request, userA.firstName, userA.lastName, userA.email, userA.password);
    cookiesA = res.headers['set-cookie'].pop().split(';')[0];
    res = await Helper.User.registerAndLoginUser(request, userB.firstName, userB.lastName, userB.email, userB.password);
    cookiesB = res.headers['set-cookie'].pop().split(';')[0];
    res = await Helper.User.registerAndLoginUser(request, userC.firstName, userC.lastName, userC.email, userC.password);
    cookiesC = res.headers['set-cookie'].pop().split(';')[0];
});

afterEach(async () => {
    await DBManager.removeAllCollections(mongoose);
});

afterAll(async () => {
    await DBManager.closeMongooseConnection(mongoose);
});


// Tests //

describe("Create a project", () => {
    // it("Should create a project", async () => {
    //     const res = await (await request.post("/projects").set("Cookie", cookiesA))
    //     .send({

    //     })
    // });
    it ("toto", () => {
        expect(true).toBe(true);
    })
});