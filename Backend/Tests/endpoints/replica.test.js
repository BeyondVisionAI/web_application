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
        userA.userId, replicaTestContent);
    replicaA2 = await Helper.Replica.createReplicaInProjectDB(mongoose, projectA._id,
        userA.userId, "replica 2", 4200, 1500, 42);
    replicaB1 = await Helper.Replica.createReplicaInProjectDB(mongoose, projectB._id,
        userB.userId, replicaTestContent);
    });

afterEach(async () => {
    await DBManager.removeAllCollections(mongoose);
});


// TESTS
describe("Get all the replicas from a project", () => {
    /// Do I truly need to test this? 
    /// The User middleware has already been tested in prior tests
    it("Should fail because the user is not logged in", async () => {
        const res = await request.get(`/projects/${projectA._id}/replicas`);

        console.debug(">> " + res.text);

        expect(res.status).toBe(401);
        expect(res.text).toBe(Errors.USER_NOT_LOGIN);
    });


    it("Should get all the replicas in the corresponding project", async () => {
        const res = await request.get(`/projects/${projectA._id}/replicas`).set("Cookie", userA.cookies);
        expect(res.status).toBe(200);
        expect(res.body.length).toBe(2);

        expect(res.body).toEqual(expect.arrayContaining([
            expect.objectContaining({
                projectId: String(projectA._id),
                _id: String(replicaA1._id),
                content: replicaTestContent,
                timestamp: 0,
                duration: 1000,
                lastEditor: expect.objectContaining({ // I populate the GET result so the lastEditor is != than userId
                    _id: userA.userId,
                    firstName: userA.firstName,
                    lastName: userA.lastName
                }),
                // lastEditDate: String(replicaA1.lastEditDate),
                voiceId: expect.any(String) // TODO
            }),
            expect.objectContaining({
                projectId: String(projectA._id),
                _id: String(replicaA2._id),
                content: replicaA2.content,
                timestamp: replicaA2.timestamp,
                duration: replicaA2.duration,
                lastEditor: expect.objectContaining({
                    _id: userA.userId,
                    firstName: userA.firstName,
                    lastName: userA.lastName
                }),
                voiceId: expect.any(String) // TODO
            })
        ]));

        ///////// WORKING TEMPLATE
        // expect(res.body[0]).toEqual(expect.objectContaining({
        //     projectId: String(projectA._id),
        //     _id: String(replicaA1._id),
        //     content: replicaTestContent,
        //     timestamp: 0,
        //     duration: 1000,
        //     lastEditor: expect.objectContaining({ // I populate the GET result so the lastEditor is != than userId
        //         _id: userA.userId,
        //         firstName: userA.firstName,
        //         lastName: userA.lastName
        //     }),
        //     // lastEditDate: String(replicaA1.lastEditDate),
        //     voiceId: expect.any(String)
        // }));
        /////////////////

        const resProjB = await request.get(`/projects/${projectB._id}/replicas`).set("Cookie", userB.cookies);
        expect(resProjB.status).toBe(200);
        expect(resProjB.body.length).toBe(1);
        expect(resProjB.body).toEqual(expect.arrayContaining([
            expect.objectContaining({
                projectId: String(projectB._id),
                _id: String(replicaB1._id),
                content: replicaB1.content,
                duration: replicaB1.duration,
                timestamp: replicaB1.timestamp,
                lastEditor: expect.objectContaining({
                    _id: userB.userId,
                    firstName: userB.firstName,
                    lastName: userB.lastName
                }),
                voiceId: expect.any(String)
            })
        ]));
    });
});