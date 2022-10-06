module.exports = function (app) {
    const authMiddleware = require('../Controllers/User/authMiddleware');
    const collabMiddleware = require('../Controllers/Collaboration/collabMiddleware');
    const FileManager = require("../Controllers/FileManager/FileManager");
    /*
    ** FileManager Routes
    */

    app.get("/FileManager/:operationType/:objectType/:objectName",
        authMiddleware.authenticateUser,
        collabMiddleware.isCollab,
        FileManager.getSignedUrl);
}