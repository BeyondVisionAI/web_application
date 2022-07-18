module.exports = function (app) {
    const S3Manager = require("../Controllers/S3Manager/S3Manager")
    const authMiddleware = require('../Controllers/User/authMiddleware');
    const collabMiddleware = require('../Controllers/Collaboration/collabMiddleware');

    /*
    ** S3Manager Routes
    */

    app.get("/S3Manger/finished-product/video/:projectId",
        // authMiddleware.authenticateUser,
        // collabMiddleware.isCollab,
        S3Manager.getFinishedProductVideo);

    app.get("/S3Manger/finished-product/audio/:projectId",
        // authMiddleware.authenticateUser,
        // collabMiddleware.isCollab,
        S3Manager.getFinishedProductAudio);
}