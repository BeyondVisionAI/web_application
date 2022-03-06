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
const { ProjectListed } = require("../../Models/list/ProjectListed");

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

describe("Get all projects", () => {
    it("Should get all projects of user", async () => {
        const res = await request.get("/projects").set("Cookie", userA.cookies);
        expect(res.status).toBe(200);
        expect(res.body).toEqual(expect.arrayContaining([
            expect.objectContaining({
                _id: String(projectA._id)
            })
        ]));
    });

    it("Should get all projects of user + one shared", async () => {
        await Helper.Project.createCollaborationDB(projectB._id, userA.userId, Role.WRITE);
        const res = await request.get("/projects").set("Cookie", userA.cookies);
        expect(res.status).toBe(200);
        expect(res.body).toEqual(expect.arrayContaining([
            expect.objectContaining({
                _id: String(projectA._id)
            }),
            expect.objectContaining({
                _id: String(projectB._id)
            })
        ]));
    });

    it("Should get an array with no projects", async () => {
        await Collaboration.deleteOne({projectId: projectA._id, userId: userA.userId});
        const res = await request.get("/projects").set("Cookie", userA.cookies);
        expect(res.status).toBe(200);
        expect(res.body.length).toBe(0);
    });

    it("Should fail because user isn't logged in", async () => {
        const res = await request.get("/projects");
        expect(res.status).toBe(401);
        expect(res.text).toBe(Errors.USER_NOT_LOGIN);
    });
});

// describe("Create a project", () => {
//     it("Should create a project", async () => {
//         const res = await request.post("/projects").set("Cookie", userA.cookies);
//     })
// });

describe("Delete a project", () => {
    it("Should remove a project", async () => {
        const res = await request.delete(`/projects/${projectA._id}`).set("Cookie", userA.cookies);
        expect(res.status).toBe(204);

        const dbCheckCollaborations = await Collaboration.find({projectId: projectA._id});
        expect(dbCheckCollaborations.length).toBe(0);

        const dbCheckProject = await Project.findById(projectA._id);
        expect(dbCheckProject).toBe(null);
    });

    it("Should remove project from list", async () => {
        const list = await Helper.List.createListAndLinkToListMemberDB("ListA", userA.userId);
        await Helper.List.createProjectListedDB(list._id, projectA._id);
        
        const dbCheck1 = await ProjectListed.find({projectId: projectA._id});
        expect(dbCheck1.length).toBe(1);

        const res = await request.delete(`/projects/${projectA._id}`).set("Cookie", userA.cookies);
        expect(res.status).toBe(204);

        const dbCheck2 = await ProjectListed.find({projectId: projectA._id});
        expect(dbCheck2.length).toBe(0);
    });

    it("Should fail because user isn't logged in", async () => {
        const res = await request.delete(`/projects/${projectA._id}`);
        expect(res.status).toBe(401);
        expect(res.text).toBe(Errors.USER_NOT_LOGIN);
    });

    it("Should fail because projectId doesn't exist", async () => {
        const res = await request.delete(`/projects/${idNotExisting}`).set("Cookie", userA.cookies);
        expect(res.status).toBe(404);
        expect(res.text).toBe(Errors.PROJECT_NOT_FOUND);
    });

    it("Should fail because user has no rights over project", async () => {
        const res = await request.delete(`/projects/${projectA._id}`).set("Cookie", userB.cookies);
        expect(res.status).toBe(401);
        expect(res.text).toBe(Errors.PROJECT_NOT_YOURS);
    });

    it("Should fail because user has Role ADMIN over project", async () => {
        await Helper.Project.createCollaborationDB(projectA._id, userB.userId, Role.ADMIN);
        const res = await request.delete(`/projects/${projectA._id}`).set("Cookie", userB.cookies);
        expect(res.status).toBe(401);
        expect(res.text).toBe(Errors.ROLE_UNAUTHORIZED);
    });

    it("Should fail because user has Role WRITE over project", async () => {
        await Helper.Project.createCollaborationDB(projectA._id, userB.userId, Role.WRITE);
        const res = await request.delete(`/projects/${projectA._id}`).set("Cookie", userB.cookies);
        expect(res.status).toBe(401);
        expect(res.text).toBe(Errors.ROLE_UNAUTHORIZED);
    });

    it("Should fail because user has Role READ over project", async () => {
        await Helper.Project.createCollaborationDB(projectA._id, userB.userId, Role.READ);
        const res = await request.delete(`/projects/${projectA._id}`).set("Cookie", userB.cookies);
        expect(res.status).toBe(401);
        expect(res.text).toBe(Errors.ROLE_UNAUTHORIZED);
    });
});

describe("Patch a project", () => {
    it("Should patch a project name", async () => {
        const res = await request.patch(`/projects/${projectA._id}`).set("Cookie", userA.cookies)
        .send({name: "Project name updated"});
        expect(res.status).toBe(200);
        expect(res.body).toEqual(expect.objectContaining({
            name: "Project name updated",
            _id: String(projectA._id)
        }));

        const dbCheck = await Project.findById(projectA._id);
        expect(dbCheck.name).toBe("Project name updated");
    });

    it("Should patch a project description", async () => {
        const res = await request.patch(`/projects/${projectA._id}`).set("Cookie", userA.cookies)
        .send({description: "Project description updated"});
        expect(res.status).toBe(200);
        expect(res.body).toEqual(expect.objectContaining({
            description: "Project description updated",
            _id: String(projectA._id)
        }));

        const dbCheck = await Project.findById(projectA._id);
        expect(dbCheck.description).toBe("Project description updated");
    });

    it("Should fail because user isn't logged in", async () => {
        const res = await request.patch(`/projects/${projectA._id}`)
        .send({name: "Project name updated"});
        expect(res.status).toBe(401);
        expect(res.text).toBe(Errors.USER_NOT_LOGIN);
    });

    it("Should fail because projectId doesn't exist", async () => {
        const res = await request.patch(`/projects/${idNotExisting}`).set("Cookie", userA.cookies)
        .send({name: "Project name updated"});
        expect(res.status).toBe(404);
        expect(res.text).toBe(Errors.PROJECT_NOT_FOUND);
    });

    it("Should fail because user isn't on the project", async () => {
        const res = await request.patch(`/projects/${projectA._id}`).set("Cookie", userB.cookies)
        .send({name: "Project name updated"});
        expect(res.status).toBe(401);
        expect(res.text).toBe(Errors.PROJECT_NOT_YOURS);
    });

    it("Should success because user is ADMIN on the project", async () => {
        await Helper.Project.createCollaborationDB(projectA._id, userB.userId, Role.ADMIN);
        const res = await request.patch(`/projects/${projectA._id}`).set("Cookie", userB.cookies)
        .send({name: "Project name updated"});
        expect(res.status).toBe(200);
    });

    it("Should fail because user is WRITE on the project", async () => {
        await Helper.Project.createCollaborationDB(projectA._id, userB.userId, Role.WRITE);
        const res = await request.patch(`/projects/${projectA._id}`).set("Cookie", userB.cookies)
        .send({name: "Project name updated"});
        expect(res.status).toBe(401);
        expect(res.text).toBe(Errors.ROLE_UNAUTHORIZED);
    });

    it("Should fail because user is READ on the project", async () => {
        await Helper.Project.createCollaborationDB(projectA._id, userB.userId, Role.READ);
        const res = await request.patch(`/projects/${projectA._id}`).set("Cookie", userB.cookies)
        .send({name: "Project name updated"});
        expect(res.status).toBe(401);
        expect(res.text).toBe(Errors.ROLE_UNAUTHORIZED);
    });
});

describe("Get collaborations on project", () => {
    it("Should get one collaboration", async () => {
        const res = await request.get(`/projects/${projectA._id}/collaborations`).set("Cookie", userA.cookies);
        expect(res.status).toBe(200);
        expect(res.body.length).toBe(1);
        expect(res.body).toEqual(expect.arrayContaining([
            expect.objectContaining({
                _id: expect.any(String),
                userId: userA.userId,
                rights: Role.OWNER,
                projectId: String(projectA._id),
                titleOfCollaboration: "Owner of Project"
            })
        ]));
    });

    it("Should get several collaborations", async () => {
        await Helper.Project.createCollaborationDB(projectA._id, userB.userId, Role.ADMIN);
        await Helper.Project.createCollaborationDB(projectA._id, userC.userId, Role.WRITE);
        const res = await request.get(`/projects/${projectA._id}/collaborations`).set("Cookie", userA.cookies);
        expect(res.status).toBe(200);
        expect(res.body.length).toBe(3);
        expect(res.body).toEqual(expect.arrayContaining([
            expect.objectContaining({
                _id: expect.any(String),
                userId: userA.userId,
                rights: Role.OWNER,
                projectId: String(projectA._id),
                titleOfCollaboration: "Owner of Project"
            }),
            expect.objectContaining({
                _id: expect.any(String),
                userId: userB.userId,
                rights: Role.ADMIN,
                projectId: String(projectA._id),
                titleOfCollaboration: "Owner of Project"
            }),
            expect.objectContaining({
                _id: expect.any(String),
                userId: userC.userId,
                rights: Role.WRITE,
                projectId: String(projectA._id),
                titleOfCollaboration: "Owner of Project"
            })
        ]));
    });

    it("Should fail because user isn't logged in", async () => {
        const res = await request.get(`/projects/${projectA._id}/collaborations`);
        expect(res.status).toBe(401);
        expect(res.text).toBe(Errors.USER_NOT_LOGIN);
    });

    it("Should fail because projectId doesn't exist", async () => {
        const res = await request.get(`/projects/${idNotExisting}/collaborations`).set("Cookie", userA.cookies);
        expect(res.status).toBe(404);
        expect(res.text).toBe(Errors.PROJECT_NOT_FOUND);
    });

    it("Should fail because user isn't collab on project", async () => {
        const res = await request.get(`/projects/${projectA._id}/collaborations`).set("Cookie", userB.cookies);
        expect(res.status).toBe(401);
        expect(res.text).toBe(Errors.PROJECT_NOT_YOURS);
    });

    it("Should success because user is ADMIN on project", async () => {
        await Helper.Project.createCollaborationDB(projectA._id, userB.userId, Role.ADMIN);
        const res = await request.get(`/projects/${projectA._id}/collaborations`).set("Cookie", userB.cookies);
        expect(res.status).toBe(200);
    });

    it("Should success because user is WRITE on project", async () => {
        await Helper.Project.createCollaborationDB(projectA._id, userB.userId, Role.WRITE);
        const res = await request.get(`/projects/${projectA._id}/collaborations`).set("Cookie", userB.cookies);
        expect(res.status).toBe(200);
    });

    it("Should success because user is READ on project", async () => {
        await Helper.Project.createCollaborationDB(projectA._id, userB.userId, Role.READ);
        const res = await request.get(`/projects/${projectA._id}/collaborations`).set("Cookie", userB.cookies);
        expect(res.status).toBe(200);
    });
});

describe("Create collaboration on project", () => {
    it("Should create a collaboration on project", async () => {
        const res = await request.post(`/projects/${projectA._id}/collaborations`).set("Cookie", userA.cookies)
        .send({
            email: userB.email,
            rights: Role.ADMIN,
            titleOfCollaboration: "Subject test"
        });

        expect(res.status).toBe(200);
        expect(res.body).toEqual(expect.objectContaining({
            userId: String(userB.userId),
            rights: Role.ADMIN,
            titleOfCollaboration: "Subject test",
            _id: expect.any(String)
        }));

        const dbCheck = await Collaboration.findOne({projectId: projectA._id, userId: userB.userId});
        expect(dbCheck).toEqual(expect.objectContaining({
            userId: mongoose.Types.ObjectId(userB.userId),
            rights: Role.ADMIN,
            titleOfCollaboration: "Subject test",
            projectId: projectA._id
        }));
    });

    it("Should fail because user isn't logged in", async () => {
        const res = await request.post(`/projects/${projectA._id}/collaborations`)
        .send({
            email: userB.email,
            rights: Role.ADMIN,
            titleOfCollaboration: "Subject test"
        });
        expect(res.status).toBe(401);
        expect(res.text).toBe(Errors.USER_NOT_LOGIN);
    });

    it("Should fail because project doesn't exist", async () => {
        const res = await request.post(`/projects/${idNotExisting}/collaborations`).set("Cookie", userC.cookies)
        .send({
            email: userB.email,
            rights: Role.ADMIN,
            titleOfCollaboration: "Subject test"
        });
        expect(res.status).toBe(404);
        expect(res.text).toBe(Errors.PROJECT_NOT_FOUND);
    });

    it("Should fail because user is not on the project", async () => {
        const res = await request.post(`/projects/${projectA._id}/collaborations`).set("Cookie", userC.cookies)
        .send({
            email: userB.email,
            rights: Role.ADMIN,
            titleOfCollaboration: "Subject test"
        });
        expect(res.status).toBe(401);
        expect(res.text).toBe(Errors.PROJECT_NOT_YOURS);
    });

    it("Should success because user is ADMIN on project", async () => {
        await Helper.Project.createCollaborationDB(projectA._id, userC.userId, Role.ADMIN);
        const res = await request.post(`/projects/${projectA._id}/collaborations`).set("Cookie", userC.cookies)
        .send({
            email: userB.email,
            rights: Role.ADMIN,
            titleOfCollaboration: "Subject test"
        });
        expect(res.status).toBe(200);
    });

    it("Should fail because user is WRITE on project", async () => {
        await Helper.Project.createCollaborationDB(projectA._id, userC.userId, Role.WRITE);
        const res = await request.post(`/projects/${projectA._id}/collaborations`).set("Cookie", userC.cookies)
        .send({
            email: userB.email,
            rights: Role.ADMIN,
            titleOfCollaboration: "Subject test"
        });
        expect(res.status).toBe(401);
        expect(res.text).toBe(Errors.ROLE_UNAUTHORIZED);
    });

    it("Should fail because user is READ on project", async () => {
        await Helper.Project.createCollaborationDB(projectA._id, userC.userId, Role.READ);
        const res = await request.post(`/projects/${projectA._id}/collaborations`).set("Cookie", userC.cookies)
        .send({
            email: userB.email,
            rights: Role.ADMIN,
            titleOfCollaboration: "Subject test"
        });
        expect(res.status).toBe(401);
        expect(res.text).toBe(Errors.ROLE_UNAUTHORIZED);
    });

    it("Should fail because no email", async () => {
        const res = await request.post(`/projects/${projectA._id}/collaborations`).set("Cookie", userA.cookies)
        .send({
            rights: Role.ADMIN,
            titleOfCollaboration: "Subject test"
        });
        expect(res.status).toBe(401);
        expect(res.text).toBe(Errors.BAD_REQUEST_MISSING_INFOS);
    });

    it("Should fail because no role", async () => {
        const res = await request.post(`/projects/${projectA._id}/collaborations`).set("Cookie", userA.cookies)
        .send({
            email: userB.email,
            titleOfCollaboration: "Subject test"
        });
        expect(res.status).toBe(401);
        expect(res.text).toBe(Errors.BAD_REQUEST_MISSING_INFOS);
    });

    it("Should fail because no titleOfCollaboration", async () => {
        const res = await request.post(`/projects/${projectA._id}/collaborations`).set("Cookie", userA.cookies)
        .send({
            email: userB.email,
            rights: Role.ADMIN,
        });
        expect(res.status).toBe(401);
        expect(res.text).toBe(Errors.BAD_REQUEST_MISSING_INFOS);
    });

    it("Should fail because role isn't valid", async () => {
        const res = await request.post(`/projects/${projectA._id}/collaborations`).set("Cookie", userA.cookies)
        .send({
            email: userB.email,
            rights: "rolenotvalid",
            titleOfCollaboration: "Subject test"
        });
        expect(res.status).toBe(401);
        expect(res.text).toBe(Errors.BAD_REQUEST_MISSING_INFOS);
    });

    it("Should fail because email is unknown", async () => {
        const res = await request.post(`/projects/${projectA._id}/collaborations`).set("Cookie", userA.cookies)
        .send({
            email: "unknown.email@toto.com",
            rights: Role.ADMIN,
            titleOfCollaboration: "Subject test"
        });
        expect(res.status).toBe(404);
        expect(res.text).toBe(Errors.EMAIL_UNKNOWN);
    });

    it("Should fail because rights in body is OWNER", async () => {
        const res = await request.post(`/projects/${projectA._id}/collaborations`).set("Cookie", userA.cookies)
        .send({
            email: userB.email,
            rights: Role.OWNER,
            titleOfCollaboration: "Subject test"
        });
        expect(res.status).toBe(400);
        expect(res.text).toBe(Errors.CANT_GIVE_OWNER_AT_CREATION);
    });

    it("Should fail because target is already in the project", async () => {
        await Helper.Project.createCollaborationDB(projectA._id, userB.userId, Role.ADMIN);
        const res = await request.post(`/projects/${projectA._id}/collaborations`).set("Cookie", userA.cookies)
        .send({
            email: userB.email,
            rights: Role.WRITE,
            titleOfCollaboration: "Subject test"
        });
        expect(res.status).toBe(401);
        expect(res.text).toBe(Errors.COLLABORATION_ALREADY_EXISTS);
    });
});

describe("Update a collaboration", () => {
    var collab;
    beforeEach(async () => {
        collab = await Helper.Project.createCollaborationDB(projectA._id, userB.userId, Role.ADMIN);
    });

    it("Should update the collaboration title", async () => {
        const res = await request.patch(`/projects/${projectA._id}/collaborations/${collab._id}`).set("Cookie", userA.cookies)
        .send({
            titleOfCollaboration: "toto"
        });
        expect(res.status).toBe(200);
        expect(res.body).toEqual(expect.objectContaining({
            userId: userB.userId,
            titleOfCollaboration: "toto",
            rights: Role.ADMIN
        }));

        const dbCheck = await Collaboration.findOne({ projectId: projectA._id, userId: userB.userId });
        expect(dbCheck).toEqual(expect.objectContaining({
            userId: mongoose.Types.ObjectId(userB.userId),
            titleOfCollaboration: "toto",
            rights: Role.ADMIN
        }));
    });

    it("Should update the collaboration role", async () => {
        const res = await request.patch(`/projects/${projectA._id}/collaborations/${collab._id}`).set("Cookie", userA.cookies)
        .send({
            rights: Role.WRITE
        });
        expect(res.status).toBe(200);
        expect(res.body).toEqual(expect.objectContaining({
            userId: userB.userId,
            titleOfCollaboration: "Owner of Project",
            rights: Role.WRITE
        }));

        const dbCheck = await Collaboration.findOne({ projectId: projectA._id, userId: userB.userId });
        expect(dbCheck).toEqual(expect.objectContaining({
            userId: mongoose.Types.ObjectId(userB.userId),
            titleOfCollaboration: "Owner of Project",
            rights: Role.WRITE
        }));
    });
});