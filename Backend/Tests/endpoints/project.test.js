const app = require("../general/server");
const supertest = require("supertest");
const req = supertest(app);
const DBManager = require("../general/dbManager");
const mongoose = require("mongoose");
const databaseName = `${process.env.TESTS_DB_PROJECT}`;

const { User } = require("../../Models/User");

var userA;
var userB;
var Cookies;

beforeAll(async () => {
    const url = `${DBManager.databaseURL}/${databaseName}`;
    await DBManager.openMongooseConnection(mongoose, url);
});

beforeEach(async () => {
    const setupUserA = {
<<<<<<< HEAD
        firstName: "toto",
        lastName: "toto",
=======
        username: "toto",
>>>>>>> ae7dc7967a634c2986598fe132a8c5a2adaa3d48
        password: "toto1234",
        email: "toto@gmail.com"
    };
    const setupUserB = {
<<<<<<< HEAD
        firstName: "tata",
        lastName: "tata",
=======
        username: "tata",
>>>>>>> ae7dc7967a634c2986598fe132a8c5a2adaa3d48
        password: "tata1234",
        email: "tata@gmail.com"
    };
    userA = await new User(setupUserA).save();
    userB = await new User(setupUserB).save();
});

afterEach(async () => {
    await DBManager.removeAllCollections(mongoose);
});

afterAll(async () => {
    await DBManager.closeMongooseConnection(mongoose);
});


describe("TRAINING", () => {
    it("Should login the user", (done) => {
        req.post("/user/login")
<<<<<<< HEAD
        .send({email: "toto@gmail.com", password: "toto1234"})
=======
        .send({username: "toto", password: "toto1234"})
>>>>>>> ae7dc7967a634c2986598fe132a8c5a2adaa3d48
        .expect(200)
        .end((err, res) => {
            expect(res.status).toBe(200);
            Cookies = res.headers['set-cookie'].pop().split(';')[0];
            done();
        });
    });

    it("Should get project", (done) => {
        var answer = req.get('/projects');
        answer.cookies = Cookies;
        answer.expect(200)
        .end(function (err, res) {
            expect(res.status).toBe(200);
            expect(res.body).toStrictEqual([]);
            done();
        });
    });
});


// describe("Get project", () => {
//     it("login puis get projects", async () => {
//         const res = await req.post("/user/login").send({username: "toto", password: "toto1234"});
//         Cookies = res.headers['set-cookie'].pop().split(';')[0];
//         expect(res.status).toBe(200);

//         req.cookies = Cookies;
//         const res2 = await req.get("/projects");
//         console.log(res2.text);
//         expect(res2.status).toBe(200);
//     });

//     it("test", () => {
//         expect(true).toBe(true);
//     })
// });







/*

PROBLEME : Je ne sais pas comment générer des user pour les requetes
y a eu des problèmes pour setup le docker (env, volumes qui se mettaient pas a jour, problemes d'acces aux db, etc...)

*/