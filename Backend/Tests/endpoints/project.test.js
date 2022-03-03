const app = require("../general/server");
const supertest = require("supertest");
const request = supertest(app);
const DBManager = require("../general/dbManager");
const mongoose = require("mongoose");
const databaseName = `${process.env.TESTS_DB_PROJECT}`;
const Helper = require("../general/helper");

const { Errors } = require("../../Models/Errors");
const { Project } = require("../../Models/Project");
const { Collaboration } = require("../../Models/Collaboration");
const { Role } = require("../../Models/Roles");

// Variables //
var userA = { firstName: "toto", lastName: "toto", email: "toto@toto.com", password: "toto1234", userId: "", cookies: "" };
var userB = { firstName: "tata", lastName: "tata", email: "tata@tata.com", password: "tata1234", userId: "", cookies: "" };
var userC = { firstName: "titi", lastName: "titi", email: "titi@titi.com", password: "titi1234", userId: "", cookies: "" };
var projectA;
var projectB;
var projectC;
const idNotExisting = "000000000000000000000000";

beforeAll(async () => {
    const url = `${DBManager.databaseURL}/${databaseName}`;
    await DBManager.openMongooseConnection(mongoose, url);
});

beforeEach(async () => {
    var res;
    res = await Helper.User.registerAndLoginUser(request, userA.firstName, userA.lastName, userA.email, userA.password);
    userA.cookies = res.headers['set-cookie'].pop().split(';')[0];
    res = await Helper.User.registerAndLoginUser(request, userB.firstName, userB.lastName, userB.email, userB.password);
    userB.cookies = res.headers['set-cookie'].pop().split(';')[0];
    res = await Helper.User.registerAndLoginUser(request, userC.firstName, userC.lastName, userC.email, userC.password);
    userC.cookies = res.headers['set-cookie'].pop().split(';')[0];
    userA.userId = (await Helper.User.getInformationsOnUser(request, userA.cookies)).body.userId;
    userB.userId = (await Helper.User.getInformationsOnUser(request, userB.cookies)).body.userId;
    userC.userId = (await Helper.User.getInformationsOnUser(request, userC.cookies)).body.userId;

    projectA = await Helper.Project.createProjectAndLinkToUserDB(mongoose, "Project A", userA.userId);
    projectB = await Helper.Project.createProjectAndLinkToUserDB(mongoose, "Project B", userB.userId);
    projectC = await Helper.Project.createProjectAndLinkToUserDB(mongoose, "Project C", userC.userId);
});

afterEach(async () => {
    await DBManager.removeAllCollections(mongoose);
});

afterAll(async () => {
    await DBManager.closeMongooseConnection(mongoose);
});

describe("Get a project", () => {
    it("Should get a project", async () => {
        const res = await request.get(`/projects/${projectA._id}`).set("Cookie", userA.cookies);
        expect(res.status).toBe(200);
        expect(res.body).toEqual(expect.objectContaining({
            name: projectA.name,
            _id: String(projectA._id)
        }));
    });

    it("Should fail because user isn't logged in", async () => {
        const res = await request.get(`/projects/${projectA._id}`);
        expect(res.status).toBe(401);
        expect(res.text).toBe(Errors.USER_NOT_LOGIN);
    });

    it("Should fail because user isn't member of project", async () => {
        const res = await request.get(`/projects/${projectA._id}`).set("Cookie", userB.cookies);
        expect(res.status).toBe(401);
        expect(res.text).toBe(Errors.PROJECT_NOT_YOURS);
    });

    it("Should fail because project id doesn't exist", async () => {
        const res = await request.get(`/projects/${idNotExisting}`).set("Cookie", userA.cookies);
        expect(res.status).toBe(404);
        expect(res.text).toBe(Errors.PROJECT_NOT_FOUND);
    });
});

describe("Create a project", () => {
    it("Should create a project", async () => {
        const res = await request.post("/projects").set("Cookie", userA.cookies);
    })
});