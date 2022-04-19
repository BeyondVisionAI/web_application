const app = require("../general/server");
const supertest = require("supertest");
const request = supertest(app);
const DBManager = require("../general/dbManager");
const mongoose = require("mongoose");
const databaseName = `${process.env.TESTS_DB_REPLICA}`;
const Helper = require("../general/helper");

const { Errors } = require("../../Models/Errors");
const { Project } = require("../../Models/Project");

// Variables //
var userA = { firstName: "toto", lastName: "toto", email: "toto@toto.com", password: "toto1234", userId: "", cookies: "" };
var userB = { firstName: "tata", lastName: "tata", email: "tata@tata.com", password: "tata1234", userId: "", cookies: "" };
var userC = { firstName: "titi", lastName: "titi", email: "titi@titi.com", password: "titi1234", userId: "", cookies: "" };
var projectA;
var projectB;
var projectC;
    // REPLICA VARIABLES
    var replicaA1;
    var replicaA2;
    var replicaB1;
    var replicaTestContent = "This is a test replica";
const idNotExisting = "000000000000000000000000";


// SETUP
beforeAll(async () => {
    const url = `${DBManager.databaseURL}/${databaseName}`;
    await DBManager.openMongooseConnection(mongoose, url);
});

afterAll(async () => {
    await DBManager.closeMongooseConnection(mongoose);
})


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

    replicaA1 = await Helper.Replica.createReplicaInProjectDB(mongoose, projectA._id,
        userA, replicaTestContent);
    replicaA2 = await Helper.Replica.createReplicaInProjectDB(mongoose, projectA._id,
        userA, "replica 2", 4200, 1500, 42);
    replicaB1 = await Helper.Replica.createReplicaInProjectDB(mongoose, projectB._id,
        userB, replicaTestContent);
    });

afterEach(async () => {
    await DBManager.removeAllCollections(mongoose);
});


// TESTS
describe("Get all the replicas from a project", () => {
    /// Do I truly need to test this? 
    /// The User middleware has already been tested in prior tests
    it("Should fail because the user is not logged in", async () => {
        const res = await request.get(`/project/${projectA._id}/replicas/`);
        expect(res.status).toBe(401);
        expect(res.text).toBe(Errors.USER_NOT_LOGIN);
    });


    it("Should get all the replicas in the corresponding project", async () => {
        const res = await request.get(`/projects/${projectA._id}/replicas`).set("Cookie", userA.cookies);
        expect(res.status).toBe(200);
        expect(res.body.length).toBe(2);
        expect(res.body).toEqual(expect.arrayContaining([
            expect.objectContaining({
                projectId: projectA._id,
                _id: replicaA1._id,
                content: replicaTestContent,
                timestamp: 0,
                duration: 1000,
                voiceId: 0,
                lastEditor: userA,
                lastEditDate: replicaA1.lastEditDate
            }),
            expect.objectContaining({
                projectId: projectA._id,
                _id: replicaA2._id,
                content: "replica 2",
                timestamp: 4200,
                duration: 1500,
                voiceId: 42,
                lastEditor: userA,
                lastEditDate: replicaA2.lastEditDate
            })
        ]));

        const res2 = await request.get(`/projects/${projectB._id}/replicas`).set("Cookie", userB.cookies);
        expect(res2.status).toBe(200);
        expect(res2.body.length).toBe(1);
        expect(res2.body).toEqual(expect.arraycontaining([
            expect.objectContaining({
                projectId: projectB._id,
                _id: replicaB1._id,
                content: replicaTestContent,
                timestamp: 0,
                duration: 1000,
                lastEditor: userB,
                lastEditDate: replicaB1.lastEditDate
            })
        ]));
    });
});