const app = require("../general/server");
const supertest = require("supertest");
const request = supertest(app);
const DBManager = require("../general/dbManager");
const mongoose = require("mongoose");
const databaseName = `${process.env.TESTS_DB_LIST}`;
const Helper = require("../general/helper");

const { Errors } = require("../../Models/Errors");
const { List } = require("../../Models/list/List");
const { ListMember } = require("../../Models/list/ListMember");
const { ProjectListed } = require("../../Models/list/ProjectListed");
const { Role } = require("../../Models/Roles");

// Variables //
var userA = { firstName: "toto", lastName: "toto", email: "toto@toto.com", password: "toto1234", userId: "", cookies: "" };
var userB = { firstName: "tata", lastName: "tata", email: "tata@tata.com", password: "tata1234", userId: "", cookies: "" };
var userC = { firstName: "titi", lastName: "titi", email: "titi@titi.com", password: "titi1234", userId: "", cookies: "" };
var projectA;
var projectB;
var projectC;
const idNotExisting = "000000000000000000000000";

// Setup //

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

describe("Get list of my projects", () => {
    it("Should get my list with one project inside", async () => {
        const res = await request.get("/lists/mine").set("Cookie", userA.cookies);
        expect(res.status).toBe(200);
        expect(res.body.length).toBe(1);
        expect(res.body[0]._id).toBe(String(projectA._id));
    });

    it("Should get my list without shared projects", async () => {
        await Helper.Project.createCollaborationDB(projectB._id, userA.userId, Role.ADMIN);
        const res = await request.get("/lists/mine").set("Cookie", userA.cookies);
        expect(res.status).toBe(200);
        expect(res.body.length).toBe(1);
        expect(res.body[0]._id).toBe(String(projectA._id));
    });

    it("Should fail because user isn't logged in", async () => {
        const res = await request.get("/lists/mine");
        expect(res.status).toBe(401);
        expect(res.text).toBe(Errors.USER_NOT_LOGIN);
    });
});

describe("Get list of shared projects", () => {
    it("Should get my list with zero project inside", async () => {
        const res = await request.get("/lists/shared").set("Cookie", userA.cookies);
        expect(res.status).toBe(200);
        expect(res.body.length).toBe(0);
    });

    it("Should get my list with one shared project", async () => {
        await Helper.Project.createCollaborationDB(projectB._id, userA.userId, Role.ADMIN);
        const res = await request.get("/lists/shared").set("Cookie", userA.cookies);
        expect(res.status).toBe(200);
        expect(res.body.length).toBe(1);
        expect(res.body[0]._id).toBe(String(projectB._id));
    });

    it("Should fail because user isn't logged in", async () => {
        const res = await request.get("/lists/shared");
        expect(res.status).toBe(401);
        expect(res.text).toBe(Errors.USER_NOT_LOGIN);
    });
});

describe("Get a custom list", () => {
    var list;
    beforeEach(async () => {
        list = await Helper.List.createListAndLinkToListMemberDB("List A", userA.userId);
    });

    it("Should get a list", async () => {
        const res = await request.get(`/lists/${list._id}`).set("Cookie", userA.cookies);
        expect(res.status).toBe(200);
        expect(res.body.name).toBe(list.name);
        expect(res.body._id).toBe(list._id.toString());
        expect(res.body.projects).toStrictEqual([]);
    });

    it("Should fail because user isn't logged in", async () => {
        const res = await request.get(`/lists/${list._id}`);
        expect(res.status).toBe(401);
        expect(res.text).toBe(Errors.USER_NOT_LOGIN);
    });

    it("Should fail because user isn't on this list", async () => {
        const res = await request.get(`/lists/${list._id}`).set("Cookie", userB.cookies);
        expect(res.status).toBe(401);
        expect(res.text).toBe(Errors.LIST_NOT_YOURS);
    });

    it("Should fail because list doesn't exist", async () => {
        const res = await request.get(`/lists/537eed02ed345b2e039652d2`).set("Cookie", userA.cookies);
        expect(res.status).toBe(404);
        expect(res.text).toBe(Errors.LIST_NOT_FOUND);
    });
});

describe("Get all custom lists", () => {
    var list1;
    var list2;
    beforeEach(async () => {
        list1 = await Helper.List.createListAndLinkToListMemberDB("List A", userA.userId);
        list2 = await Helper.List.createListAndLinkToListMemberDB("List B", userB.userId);
    });

    it("Should get one list", async () => {
        const res = await request.get("/lists").set("Cookie", userA.cookies);
        expect(res.status).toBe(200);
        expect(res.body.length).toBe(1);
        expect(res.body[0]._id).toBe(String(list1._id));
        expect(res.body[0].name).toBe(list1.name);
    });

    it("Should get two lists (one mine and one shared)", async () => {
        await Helper.List.createListMemberDB(list2._id, userA.userId, Role.ADMIN);
        const res = await request.get("/lists").set("Cookie", userA.cookies);
        expect(res.status).toBe(200);
        expect(res.body.length).toBe(2);
    });
});

describe("Create a list", () => {
    const listNameA = "List Name A";
    it ("Should create a list", async () => {
        const res = await request.post("/lists").set("Cookie", userA.cookies)
        .send({ name: listNameA });
        expect(res.status).toBe(200);
        expect(res.body).toEqual(expect.objectContaining({ name: listNameA }));

        const dbContentList = await List.find();
        expect(dbContentList.length).toBe(1);
        expect(dbContentList[0]).toEqual(expect.objectContaining({
            name: listNameA,
            id: res.body._id
        }));

        const dbContentListMember = await ListMember.find();
        expect(dbContentListMember.length).toBe(1);
        expect(dbContentListMember[0]).toEqual(expect.objectContaining({
            userId: mongoose.Types.ObjectId(userA.userId),
            listId: mongoose.Types.ObjectId(res.body._id),
            rights: Role.OWNER
        }));
    });

    it ("Should fail because user not logged in", async () => {
        const res = await request.post("/lists")
        .send({ name: listNameA });
        expect(res.status).toBe(401);
        expect(res.text).toBe(Errors.USER_NOT_LOGIN);
    });

    it ("Should fail because missing name", async () => {
        const res = await request.post("/lists").set("Cookie", userA.cookies);
        expect(res.status).toBe(401);
        expect(res.text).toBe(Errors.BAD_REQUEST_MISSING_INFOS);
    });

});

describe("Add project to a list", () => {
    var list;
    beforeEach(async () => {
        list = await Helper.List.createListAndLinkToListMemberDB("List A", userA.userId);
    });

    it("Should add project to a list", async () => {
        const res = await request.post(`/lists/${list._id}/projects/${projectA._id}`).set("Cookie", userA.cookies);
        expect(res.status).toBe(200);
        const dbCheck = await ProjectListed.find();
        expect(dbCheck.length).toBe(1);
        expect(dbCheck[0]).toEqual(expect.objectContaining({
            projectId: mongoose.Types.ObjectId(projectA._id),
            listId: mongoose.Types.ObjectId(list._id)
        }));
    });

    it("Should fail because user isn't logged in", async () => {
        const res = await request.post(`/lists/${list._id}/projects/${projectA._id}`);
        expect(res.status).toBe(401);
        expect(res.text).toBe(Errors.USER_NOT_LOGIN);
    });

    it("Should fail because list doesn't exist", async () => {
        const res = await request.post(`/lists/${idNotExisting}/projects/${projectA._id}`).set("Cookie", userA.cookies);
        expect(res.status).toBe(404);
        expect(res.text).toBe(Errors.LIST_NOT_FOUND);
    });

    it("Should fail because project doesn't exist", async () => {
        const res = await request.post(`/lists/${list._id}/projects/${idNotExisting}`).set("Cookie", userA.cookies);
        expect(res.status).toBe(404);
        expect(res.text).toBe(Errors.PROJECT_NOT_FOUND);
    });

    it("Should fail because user isn't member of the list", async () => {
        const res = await request.post(`/lists/${list._id}/projects/${projectB._id}`).set("Cookie", userB.cookies);
        expect(res.status).toBe(401);
        expect(res.text).toBe(Errors.LIST_NOT_YOURS);
    });

    it("Should success because user is ADMIN on the list", async () => {
        await Helper.List.createListMemberDB(list._id, userB.userId, Role.ADMIN);
        const res = await request.post(`/lists/${list._id}/projects/${projectB._id}`).set("Cookie", userB.cookies);
        expect(res.status).toBe(200);
    });

    it("Should success because user is WRITE on the list", async () => {
        await Helper.List.createListMemberDB(list._id, userB.userId, Role.WRITE);
        const res = await request.post(`/lists/${list._id}/projects/${projectB._id}`).set("Cookie", userB.cookies);
        expect(res.status).toBe(200);
    });

    it("Should fail because user is READ on the list", async () => {
        await Helper.List.createListMemberDB(list._id, userB.userId, Role.READ);
        const res = await request.post(`/lists/${list._id}/projects/${projectB._id}`).set("Cookie", userB.cookies);
        expect(res.status).toBe(401);
        expect(res.text).toBe(Errors.ROLE_UNAUTHORIZED);
    });

    it("Should fail because user isn't collab on the project", async () => {
        const res = await request.post(`/lists/${list._id}/projects/${projectB._id}`).set("Cookie", userA.cookies);
        expect(res.status).toBe(401);
        expect(res.text).toBe(Errors.PROJECT_NOT_YOURS);
    });

    it("Should fail because project is already in list", async () => {
        const res = await request.post(`/lists/${list._id}/projects/${projectA._id}`).set("Cookie", userA.cookies);
        expect(res.status).toBe(200);
        const res2 = await request.post(`/lists/${list._id}/projects/${projectA._id}`).set("Cookie", userA.cookies);
        expect(res2.status).toBe(401);
        expect(res2.text).toBe(Errors.PROJECT_LISTED_ALREADY_EXISTS);
    });
});

describe("Remove a project from list", () => {
    var list;
    beforeEach(async () => {
        list = await Helper.List.createListAndLinkToListMemberDB("List A", userA.userId);
        await Helper.List.createProjectListedDB(list._id, projectA._id);
    });

    it("Should remove project from list", async () => {
        const res = await request.delete(`/lists/${list._id}/projects/${projectA._id}`).set("Cookie", userA.cookies);
        expect(res.status).toBe(204);
        expect(res.text).toBe("");
        const dbCheck = await ProjectListed.find();
        expect(dbCheck.length).toBe(0);
    });

    it("Should fail because user isn't logged in", async () => {
        const res = await request.delete(`/lists/${list._id}/projects/${projectA._id}`);
        expect(res.status).toBe(401);
        expect(res.text).toBe(Errors.USER_NOT_LOGIN);
    });

    it("Should fail because list doesn't exist", async () => {
        const res = await request.delete(`/lists/${idNotExisting}/projects/${projectA._id}`).set("Cookie", userA.cookies);
        expect(res.status).toBe(404);
        expect(res.text).toBe(Errors.LIST_NOT_FOUND);
    });

    it("Should fail because user isn't on the list", async () => {
        const res = await request.delete(`/lists/${list._id}/projects/${projectA._id}`).set("Cookie", userB.cookies);
        expect(res.status).toBe(401);
        expect(res.text).toBe(Errors.LIST_NOT_YOURS);
    });

    it("Should success because user is admin on the list", async () => {
        await Helper.List.createListMemberDB(list._id, userB.userId, Role.ADMIN);
        const res = await request.delete(`/lists/${list._id}/projects/${projectA._id}`).set("Cookie", userB.cookies);
        expect(res.status).toBe(204);
        expect(res.text).toBe("");
    });

    it("Should success because user is write on the list", async () => {
        await Helper.List.createListMemberDB(list._id, userB.userId, Role.WRITE);
        const res = await request.delete(`/lists/${list._id}/projects/${projectA._id}`).set("Cookie", userB.cookies);
        expect(res.status).toBe(204);
        expect(res.text).toBe("");
    });

    it("Should fail because user is read on the list", async () => {
        await Helper.List.createListMemberDB(list._id, userB.userId, Role.READ);
        const res = await request.delete(`/lists/${list._id}/projects/${projectA._id}`).set("Cookie", userB.cookies);
        expect(res.status).toBe(401);
        expect(res.text).toBe(Errors.ROLE_UNAUTHORIZED);
    });

    it("Should fail because project doesn't exist", async () => {
        const res = await request.delete(`/lists/${list._id}/projects/${idNotExisting}`).set("Cookie", userA.cookies);
        expect(res.status).toBe(404);
        expect(res.text).toBe(Errors.PROJECT_LISTED_NOT_FOUND);
    });

    it("Should fail because project isn't on the list", async () => {
        const res = await request.delete(`/lists/${list._id}/projects/${projectB._id}`).set("Cookie", userA.cookies);
        expect(res.status).toBe(404);
        expect(res.text).toBe(Errors.PROJECT_LISTED_NOT_FOUND);
    });
});

describe("Delete a list", () => {
    var list;
    beforeEach(async () => {
        list = await Helper.List.createListAndLinkToListMemberDB("List A", userA.userId);
    });

    it("Should delete the list", async () => {
        await Helper.List.createProjectListedDB(list._id, projectA._id);
        const res = await request.delete(`/lists/${list._id}`).set("Cookie", userA.cookies);
        expect(res.status).toBe(204);
        expect(res.text).toBe("");
        const dbCheckList = await List.find();
        expect(dbCheckList.length).toBe(0);
        const dbCheckListMember = await ListMember.find();
        expect(dbCheckListMember.length).toBe(0);
        const dbCheckProjectListed = await ProjectListed.find();
        expect(dbCheckProjectListed.length).toBe(0);
    });

    it("Should fail because user isn't logged in", async () => {
        const res = await request.delete(`/lists/${list._id}`);
        expect(res.status).toBe(401);
        expect(res.text).toBe(Errors.USER_NOT_LOGIN);
    });
    
    it("Should fail because list doesn't exist", async () => {
        const res = await request.delete(`/lists/${idNotExisting}`).set("Cookie", userA.cookies);
        expect(res.status).toBe(404);
        expect(res.text).toBe(Errors.LIST_NOT_FOUND);
    });

    it("Should fail because list isn't yours", async () => {
        const res = await request.delete(`/lists/${list._id}`).set("Cookie", userB.cookies);
        expect(res.status).toBe(401);
        expect(res.text).toBe(Errors.LIST_NOT_YOURS);
    });

    it("Should fail because user is admin of the list", async () => {
        await Helper.List.createListMemberDB(list._id, userB.userId, Role.ADMIN);
        const res = await request.delete(`/lists/${list._id}`).set("Cookie", userB.cookies);
        expect(res.status).toBe(401);
        expect(res.text).toBe(Errors.ROLE_UNAUTHORIZED);
    });

    it("Should fail because user is write of the list", async () => {
        await Helper.List.createListMemberDB(list._id, userB.userId, Role.WRITE);
        const res = await request.delete(`/lists/${list._id}`).set("Cookie", userB.cookies);
        expect(res.status).toBe(401);
        expect(res.text).toBe(Errors.ROLE_UNAUTHORIZED);
    });

    it("Should fail because user is read of the list", async () => {
        await Helper.List.createListMemberDB(list._id, userB.userId, Role.READ);
        const res = await request.delete(`/lists/${list._id}`).set("Cookie", userB.cookies);
        expect(res.status).toBe(401);
        expect(res.text).toBe(Errors.ROLE_UNAUTHORIZED);
    });
});

describe("Leave a list", () => {
    var list;
    beforeEach(async () => {
        list = await Helper.List.createListAndLinkToListMemberDB("List A", userA.userId);
        await Helper.List.createListMemberDB(list._id, userB.userId, Role.ADMIN);
    });

    it("Should leave the list", async () => {
        var dbCheck = await ListMember.find();
        expect(dbCheck.length).toBe(2);
        const res = await request.post(`/lists/${list._id}/leave`).set("Cookie", userB.cookies);
        expect(res.status).toBe(200);
        expect(res.text).toBe("");
        dbCheck = await ListMember.find();
        expect(dbCheck.length).toBe(1);
        expect(dbCheck[0].userId).toEqual(mongoose.Types.ObjectId(userA.userId));
    });

    it("Should fail because user isn't logged in", async () => {
        const res = await request.post(`/lists/${list._id}/leave`);
        expect(res.status).toBe(401);
        expect(res.text).toBe(Errors.USER_NOT_LOGIN);
    });

    it("Should fail because list doesn't exist", async () => {
        const res = await request.post(`/lists/${idNotExisting}/leave`).set("Cookie", userB.cookies);
        expect(res.status).toBe(404);
        expect(res.text).toBe(Errors.LIST_NOT_FOUND);
    });

    it("Should fail because user isn't member of the list", async () => {
        const res = await request.post(`/lists/${list._id}/leave`).set("Cookie", userC.cookies);
        expect(res.status).toBe(401);
        expect(res.text).toBe(Errors.LIST_NOT_YOURS);
    });

    it("Should fail because user is owner of the list", async () => {
        const res = await request.post(`/lists/${list._id}/leave`).set("Cookie", userA.cookies);
        expect(res.status).toBe(401);
        expect(res.text).toBe(Errors.ROLE_UNAUTHORIZED);
    });

    it("Should success because user is admin of the list", async () => {
        await Helper.List.createListMemberDB(list._id, userC.userId, Role.ADMIN);
        const res = await request.post(`/lists/${list._id}/leave`).set("Cookie", userC.cookies);
        expect(res.status).toBe(200);
    });

    it("Should success because user is write of the list", async () => {
        await Helper.List.createListMemberDB(list._id, userC.userId, Role.WRITE);
        const res = await request.post(`/lists/${list._id}/leave`).set("Cookie", userC.cookies);
        expect(res.status).toBe(200);
    });

    it("Should success because user is read of the list", async () => {
        await Helper.List.createListMemberDB(list._id, userC.userId, Role.READ);
        const res = await request.post(`/lists/${list._id}/leave`).set("Cookie", userC.cookies);
        expect(res.status).toBe(200);
    });
});

describe("Get list's members", () => {
    var list;
    beforeEach(async () => {
        list = await Helper.List.createListAndLinkToListMemberDB("List A", userA.userId);
        await Helper.List.createListMemberDB(list._id, userB.userId, Role.ADMIN);
    });

    it("Should get members of the list", async () => {
        const res = await request.get(`/lists/${list._id}/members`).set("Cookie", userA.cookies);
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBe(2);
        expect(res.body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    userId: String(userA.userId),
                    listId: String(list._id),
                    rights: Role.OWNER
                }),
                expect.objectContaining({
                    userId: String(userB.userId),
                    listId: String(list._id),
                    rights: Role.ADMIN
                })
            ])
        );
    });

    it("Should fail because user isn't logged in", async () => {
        const res = await request.get(`/lists/${list._id}/members`);
        expect(res.status).toBe(401);
        expect(res.text).toBe(Errors.USER_NOT_LOGIN);
    });

    it("Should fail because list doesn't exist", async () => {
        const res = await request.get(`/lists/${idNotExisting}/members`).set("Cookie", userA.cookies);
        expect(res.status).toBe(404);
        expect(res.text).toBe(Errors.LIST_NOT_FOUND);
    });

    it("Should fail because list doesn't exist", async () => {
        const res = await request.get(`/lists/${list._id}/members`).set("Cookie", userC.cookies);
        expect(res.status).toBe(401);
        expect(res.text).toBe(Errors.LIST_NOT_YOURS);
    });
});

describe("Add new list member", () => {
    var list;
    beforeEach(async () => {
        list = await Helper.List.createListAndLinkToListMemberDB("List A", userA.userId);
    });

    it("Should add new list member", async () => {
        const res = await request.post(`/lists/${list._id}/members`).set("Cookie", userA.cookies)
        .send({email: userB.email, rights: Role.ADMIN});
        expect(res.status).toBe(200);
        const dbCheck = await ListMember.find();
        expect(dbCheck.length).toBe(2);
        expect(dbCheck).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    userId: mongoose.Types.ObjectId(userA.userId),
                    listId: mongoose.Types.ObjectId(list._id),
                    rights: Role.OWNER
                }),
                expect.objectContaining({
                    userId: mongoose.Types.ObjectId(userB.userId),
                    listId: mongoose.Types.ObjectId(list._id),
                    rights: Role.ADMIN
                })
            ])
        );
    });

    it("Should fail because user in't logged in", async () => {
        const res = await request.post(`/lists/${list._id}/members`)
        .send({email: userB.email, rights: Role.ADMIN});
        expect(res.status).toBe(401);
        expect(res.text).toBe(Errors.USER_NOT_LOGIN);
    });

    it("Should fail because list doesn't exist", async () => {
        const res = await request.post(`/lists/${idNotExisting}/members`).set("Cookie", userA.cookies)
        .send({email: userB.email, rights: Role.ADMIN});
        expect(res.status).toBe(404);
        expect(res.text).toBe(Errors.LIST_NOT_FOUND);
    });

    it("Should fail because list isn't yours", async () => {
        const res = await request.post(`/lists/${list._id}/members`).set("Cookie", userC.cookies)
        .send({email: userB.email, rights: Role.ADMIN});
        expect(res.status).toBe(401);
        expect(res.text).toBe(Errors.LIST_NOT_YOURS);
    });

    it("Should success because user is ADMIN on the list", async () => {
        await Helper.List.createListMemberDB(list._id, userC.userId, Role.ADMIN);
        const res = await request.post(`/lists/${list._id}/members`).set("Cookie", userC.cookies)
        .send({email: userB.email, rights: Role.ADMIN});
        expect(res.status).toBe(200);
    });

    it("Should fail because user is WRITE on the list", async () => {
        await Helper.List.createListMemberDB(list._id, userC.userId, Role.WRITE);
        const res = await request.post(`/lists/${list._id}/members`).set("Cookie", userC.cookies)
        .send({email: userB.email, rights: Role.ADMIN});
        expect(res.status).toBe(401);
        expect(res.text).toBe(Errors.ROLE_UNAUTHORIZED);
    });

    it("Should fail because user is READ on the list", async () => {
        await Helper.List.createListMemberDB(list._id, userC.userId, Role.READ);
        const res = await request.post(`/lists/${list._id}/members`).set("Cookie", userC.cookies)
        .send({email: userB.email, rights: Role.ADMIN});
        expect(res.status).toBe(401);
        expect(res.text).toBe(Errors.ROLE_UNAUTHORIZED);
    });

    it("Should fail because no body on request", async () => {
        const res = await request.post(`/lists/${list._id}/members`).set("Cookie", userA.cookies)
        expect(res.status).toBe(401);
        expect(res.text).toBe(Errors.BAD_REQUEST_MISSING_INFOS);
    });

    it("Should fail because no email on body", async () => {
        const res = await request.post(`/lists/${list._id}/members`).set("Cookie", userA.cookies)
        .send({rights: Role.ADMIN});
        expect(res.status).toBe(401);
        expect(res.text).toBe(Errors.BAD_REQUEST_MISSING_INFOS);
    });

    it("Should fail because no rights on body", async () => {
        const res = await request.post(`/lists/${list._id}/members`).set("Cookie", userA.cookies)
        .send({email: userB.email});
        expect(res.status).toBe(401);
        expect(res.text).toBe(Errors.BAD_REQUEST_MISSING_INFOS);
    });

    it("Should fail because invalid rights on body", async () => {
        const res = await request.post(`/lists/${list._id}/members`).set("Cookie", userA.cookies)
        .send({email: userB.email, rights: "toto"});
        expect(res.status).toBe(401);
        expect(res.text).toBe(Errors.BAD_REQUEST_MISSING_INFOS);
    });

    it("Should fail because email unknown on body", async () => {
        const res = await request.post(`/lists/${list._id}/members`).set("Cookie", userA.cookies)
        .send({email: "tutu@tutu.com", rights: Role.ADMIN});
        expect(res.status).toBe(404);
        expect(res.text).toBe(Errors.EMAIL_UNKNOWN);
    });

    it("Should fail because rights on body is OWNER", async () => {
        const res = await request.post(`/lists/${list._id}/members`).set("Cookie", userA.cookies)
        .send({email: userB.email, rights: Role.OWNER});
        expect(res.status).toBe(400);
        expect(res.text).toBe(Errors.CANT_GIVE_OWNER_AT_CREATION);
    });

    it("Should fail because user target is already a member of the list", async () => {
        await Helper.List.createListMemberDB(list._id, userB.userId, Role.ADMIN);
        const res = await request.post(`/lists/${list._id}/members`).set("Cookie", userA.cookies)
        .send({email: userB.email, rights: Role.ADMIN});
        expect(res.status).toBe(400);
        expect(res.text).toBe(Errors.LIST_MEMBER_ALREADY_EXISTS);
    });
});

describe("Update role of member in a list", () => {
    var list;
    beforeEach(async () => {
        list = await Helper.List.createListAndLinkToListMemberDB("List", userA.userId);
        await Helper.List.createListMemberDB(list._id, userB.userId, Role.ADMIN);
    });

    it("Should update role of ListMember", async () => {
        const res = await request.patch(`/lists/${list._id}/members/${userB.userId}`).set("Cookie", userA.cookies)
        .send({rights: Role.WRITE});
        expect(res.status).toBe(200);
        expect(res.body).toEqual(expect.objectContaining({
            listId: String(list._id),
            userId: userB.userId,
            rights: Role.WRITE
        }));
        const dbCheck = await ListMember.findOne({listId: list._id, userId: userB.userId});
        expect(dbCheck).toEqual(expect.objectContaining({
            listId: mongoose.Types.ObjectId(list._id),
            userId: mongoose.Types.ObjectId(userB.userId),
            rights: Role.WRITE
        }));
    });

    it("Should fail because user isn't logged in", async () => {
        const res = await request.patch(`/lists/${list._id}/members/${userB.userId}`)
        .send({rights: Role.WRITE});
        expect(res.status).toBe(401);
        expect(res.text).toBe(Errors.USER_NOT_LOGIN);
    });

    it("Should fail because list doesn't exist", async () => {
        const res = await request.patch(`/lists/${idNotExisting}/members/${userB.userId}`).set("Cookie", userA.cookies)
        .send({rights: Role.WRITE});
        expect(res.status).toBe(404);
        expect(res.text).toBe(Errors.LIST_NOT_FOUND);
    });

    it("Should fail because user isn't a listMember", async () => {
        const res = await request.patch(`/lists/${list._id}/members/${userB.userId}`).set("Cookie", userC.cookies)
        .send({rights: Role.WRITE});
        expect(res.status).toBe(401);
        expect(res.text).toBe(Errors.LIST_NOT_YOURS);
    });

    it("Should success because user is ADMIN on list", async () => {
        await Helper.List.createListMemberDB(list._id, userC.userId, Role.ADMIN);
        const res = await request.patch(`/lists/${list._id}/members/${userB.userId}`).set("Cookie", userC.cookies)
        .send({rights: Role.WRITE});
        expect(res.status).toBe(200);
    });

    it("Should fail because user is WRITE on list", async () => {
        await Helper.List.createListMemberDB(list._id, userC.userId, Role.WRITE);
        const res = await request.patch(`/lists/${list._id}/members/${userB.userId}`).set("Cookie", userC.cookies)
        .send({rights: Role.WRITE});
        expect(res.status).toBe(401);
        expect(res.text).toBe(Errors.ROLE_UNAUTHORIZED);
    });

    it("Should fail because target is unknown", async () => {
        const res = await request.patch(`/lists/${list._id}/members/${idNotExisting}`).set("Cookie", userA.cookies)
        .send({rights: Role.WRITE});
        expect(res.status).toBe(404);
        expect(res.text).toBe(Errors.LIST_MEMBER_NOT_FOUND);
    });

    it("Should fail because target isn't member of the list", async () => {
        const res = await request.patch(`/lists/${list._id}/members/${userC.userId}`).set("Cookie", userA.cookies)
        .send({rights: Role.WRITE});
        expect(res.status).toBe(404);
        expect(res.text).toBe(Errors.LIST_MEMBER_NOT_FOUND);
    });

    it("Should fail because target is the OWNER of the list", async () => {
        const res = await request.patch(`/lists/${list._id}/members/${userA.userId}`).set("Cookie", userB.cookies)
        .send({rights: Role.WRITE});
        expect(res.status).toBe(401);
        expect(res.text).toBe(Errors.ROLE_UNAUTHORIZED);
    });

    it("Should fail because no rights on the body", async () => {
        const res = await request.patch(`/lists/${list._id}/members/${userB.userId}`).set("Cookie", userA.cookies)
        expect(res.status).toBe(401);
        expect(res.text).toBe(Errors.BAD_REQUEST_MISSING_INFOS);
    });

    it("Should fail because rights not valid on the body", async () => {
        const res = await request.patch(`/lists/${list._id}/members/${userB.userId}`).set("Cookie", userA.cookies)
        .send({rights: "toto"});
        expect(res.status).toBe(401);
        expect(res.text).toBe(Errors.BAD_REQUEST_MISSING_INFOS);
    });

    it("Should fail because ADMIN user is trying to promote another member to OWNER", async () => {
        await Helper.List.createListMemberDB(list._id, userC.userId, Role.ADMIN);
        const res = await request.patch(`/lists/${list._id}/members/${userC.userId}`).set("Cookie", userB.cookies)
        .send({rights: Role.OWNER});
        expect(res.status).toBe(401);
        expect(res.text).toBe(Errors.ROLE_UNAUTHORIZED);
    });

    it("Should success because OWNER is trying to promote member to OWNER, so OWNER become ADMIN", async () => {
        const res = await request.patch(`/lists/${list._id}/members/${userB.userId}`).set("Cookie", userA.cookies)
        .send({rights: Role.OWNER});
        expect(res.status).toBe(200);
        expect(res.body).toEqual(expect.objectContaining({
            listId: String(list._id),
            userId: userB.userId,
            rights: Role.OWNER
        }));
        const dbCheck = await ListMember.find({listId: list._id});
        expect(dbCheck).toEqual(expect.arrayContaining([
            expect.objectContaining({
                listId: mongoose.Types.ObjectId(list._id),
                userId: mongoose.Types.ObjectId(userA.userId),
                rights: Role.ADMIN
            }),
            expect.objectContaining({
                listId: mongoose.Types.ObjectId(list._id),
                userId: mongoose.Types.ObjectId(userB.userId),
                rights: Role.OWNER
            })
        ]));
    });
});

describe("Remove member from List", () => {
    var list;
    beforeEach(async () => {
        list = await Helper.List.createListAndLinkToListMemberDB("List A", userA.userId);
        await Helper.List.createListMemberDB(list._id, userB.userId, Role.ADMIN);
    });

    it("Should remove member from list", async () => {
        const res = await request.delete(`/lists/${list._id}/members/${userB.userId}`).set("Cookie", userA.cookies);
        expect(res.status).toBe(204);
        const dbCheck = await ListMember.find();
        expect(dbCheck.length).toBe(1);
        expect(dbCheck[0]).toEqual(expect.objectContaining({
            listId: mongoose.Types.ObjectId(list._id),
            userId: mongoose.Types.ObjectId(userA.userId),
            rights: Role.OWNER
        }));
    });

    it("Should fail because user isn't logged in", async () => {
        const res = await request.delete(`/lists/${list._id}/members/${userB.userId}`);
        expect(res.status).toBe(401);
        expect(res.text).toBe(Errors.USER_NOT_LOGIN);
    });

    it("Should fail because list doesn't exist", async () => {
        const res = await request.delete(`/lists/${idNotExisting}/members/${userB.userId}`).set("Cookie", userA.cookies);
        expect(res.status).toBe(404);
        expect(res.text).toBe(Errors.LIST_NOT_FOUND);
    });

    it("Should fail because user isn't on list", async () => {
        const res = await request.delete(`/lists/${list._id}/members/${userB.userId}`).set("Cookie", userC.cookies);
        expect(res.status).toBe(401);
        expect(res.text).toBe(Errors.LIST_NOT_YOURS);
    });

    it("Should success because user is ADMIN on the list", async () => {
        await Helper.List.createListMemberDB(list._id, userC.userId, Role.ADMIN);
        const res = await request.delete(`/lists/${list._id}/members/${userB.userId}`).set("Cookie", userC.cookies);
        expect(res.status).toBe(204);
    });

    it("Should fail because user is WRITE on the list", async () => {
        await Helper.List.createListMemberDB(list._id, userC.userId, Role.WRITE);
        const res = await request.delete(`/lists/${list._id}/members/${userB.userId}`).set("Cookie", userC.cookies);
        expect(res.status).toBe(401);
        expect(res.text).toBe(Errors.ROLE_UNAUTHORIZED);
    });

    it("Should fail because user is READ on the list", async () => {
        await Helper.List.createListMemberDB(list._id, userC.userId, Role.READ);
        const res = await request.delete(`/lists/${list._id}/members/${userB.userId}`).set("Cookie", userC.cookies);
        expect(res.status).toBe(401);
        expect(res.text).toBe(Errors.ROLE_UNAUTHORIZED);
    });

    it("Should fail because target doesn't exist", async () => {
        const res = await request.delete(`/lists/${list._id}/members/${idNotExisting}`).set("Cookie", userA.cookies);
        expect(res.status).toBe(404);
        expect(res.text).toBe(Errors.LIST_MEMBER_NOT_FOUND);
    });

    it("Should fail because target isn't member of the list", async () => {
        const res = await request.delete(`/lists/${list._id}/members/${userC.userId}`).set("Cookie", userA.cookies);
        expect(res.status).toBe(404);
        expect(res.text).toBe(Errors.LIST_MEMBER_NOT_FOUND);
    });

    it("Should fail because target is the user", async () => {
        const res = await request.delete(`/lists/${list._id}/members/${userB.userId}`).set("Cookie", userB.cookies);
        expect(res.status).toBe(401);
        expect(res.text).toBe(Errors.LIST_MEMBER_CANT_BE_CHANGED_YOURS);
    });

    it("Should fail because target is the OWNER of the list", async () => {
        const res = await request.delete(`/lists/${list._id}/members/${userA.userId}`).set("Cookie", userB.cookies);
        expect(res.status).toBe(401);
        expect(res.text).toBe(Errors.ROLE_UNAUTHORIZED);
    });
});