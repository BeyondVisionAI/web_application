module.exports = function (app) {
    const authMiddleware = require("../Controllers/User/authMiddleware");
    const collabMiddleware = require("../Controllers/Collaboration/collabMiddleware");
    const MinioManager = require("../Controllers/MinioManager/MinioManager");
    /*
    ** MinioManager Routes
    */

    app.get("/MinioManger/:operationType/:objectType/:objectName",
        authMiddleware.authenticateUser,
        collabMiddleware.isCollab,
        MinioManager.getSignedUrl());
}