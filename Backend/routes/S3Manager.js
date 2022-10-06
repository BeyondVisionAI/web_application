module.exports = function (app) {
    const authMiddleware = require('../Controllers/User/authMiddleware');
    const collabMiddleware = require('../Controllers/Collaboration/collabMiddleware');
    const S3Manager = require("../Controllers/S3Manager/S3Manager");
    /*
    ** S3Manager Routes
    */

    app.get("/S3Manager/:operationType/:objectType/:objectName",
        authMiddleware.authenticateUser,
        collabMiddleware.isCollab,
        S3Manager.getSignedUrl());
}