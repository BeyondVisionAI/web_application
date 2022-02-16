const app = require("../general/server"); //Setup server
const supertest = require("supertest"); //Supertest is used to send request
const req = supertest(app);
const DBManager = require("../general/dbManager");
const mongoose = require("mongoose"); //Setup de la DB pour ce fichier
const databaseName = `${process.env.TESTS_DB_EXAMPLE}`; //Nom unique !

const { User } = require('../../Models/User'); //To add values directly to DB

//Call at the start of the file
beforeAll(async () => {
    //Connect to DB (l'url en local sur votre PC)
    const url = `${DBManager.databaseURL}/${databaseName}`;
    await DBManager.openMongooseConnection(mongoose, url);
});

it("Test connection to server", async () => {
    const res = await req.get("/test");
    expect(res.status).toBe(200);
});

describe("User creation", () => {
    //Test if everything is normal
    it ("success creation user", async () => {
        const res = await req.post('/user/register').send({
            firstName: 'toto',
            lastName: 'tutu',
            password: 'toto1234',
            email: 'toto@toto.com'
        });
        expect(res.status).toBe(200);
        expect(res.body).toStrictEqual({});
    })
});

describe("User creation failed", () => {
    const userTest = {
        firstName: "toto",
        lastName: "titi",
        password: "toto1234",
        email: "toto@toto.com"
    };
    beforeEach(async () => {
        //before each test of this describe, we generate a user
        await new User(userTest).save();  
    });

    //Check if email already exists
    it ("Fail because email already exists", async () => {
        const res = await req.post('/user/register').send({
            firstName: 'tata',
            lastName: 'titi',
            password: 'tata1234',
            email: 'toto@toto.com'
        });
        expect(res.status).toBe(409);
        expect(res.body).toStrictEqual({});
    });

    it ("success", async () => {
        const res = await req.post('/user/login').send({
            email: "toto@toto.com",
            password: "toto1234"
        });
        expect(res.status).toBe(200);
        expect(res.text).toStrictEqual("Success")
    });

    afterEach(async () => {
        //Reset the DB content after each test
        await DBManager.removeAllCollections(mongoose);
    });
});

afterEach(async () => {
    //Reset the DB content after each test
    await DBManager.removeAllCollections(mongoose);
});

afterAll(async () => {
    await DBManager.closeMongooseConnection(mongoose);
});