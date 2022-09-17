module.exports = function (app) {
    const S3Manager = require("../Controllers/S3Manager/S3Manager")
    const authMiddleware = require('../Controllers/User/authMiddleware');
    const collabMiddleware = require('../Controllers/Collaboration/collabMiddleware');

    /*
    ** S3Manager Routes
    */

    app.get("/S3Manger/finished-product/video/url/:projectId",
        authMiddleware.authenticateUser,
        collabMiddleware.isCollab,
        S3Manager.getUrlFinishedProductVideo);


    // app.get("/S3Manger/finished-product/video/:projectId",
    //     authMiddleware.authenticateUser,
    //     collabMiddleware.isCollab,
    //     S3Manager.getFinishedProductVideo);

    app.get("/S3Manger/finished-product/audio/url/:projectId",
        authMiddleware.authenticateUser,
        collabMiddleware.isCollab,
        S3Manager.getUrlFinishedProductAudio);

    // app.get("/S3Manger/finished-product/audio/:projectId",
    //     authMiddleware.authenticateUser,
    //     collabMiddleware.isCollab,
    //     S3Manager.getFinishedProductAudio);

    app.get("/S3Manger/source-product/video/url/:projectId",
        authMiddleware.authenticateUser,
        collabMiddleware.isCollab,
        S3Manager.getUrlSourceProductVideo);

    // app.post("/S3Manger/source-product/video/:projectId",
    //     authMiddleware.authenticateUser,
    //     collabMiddleware.isCollab,
    //     S3Manager.postSourceProductVideo);

    app.get("/S3Manger/source-product/thumbnail/url/:projectId",
        authMiddleware.authenticateUser,
        collabMiddleware.isCollab,
        S3Manager.getUrlSourceProductThumbnail);

    // app.post("/S3Manger/source-product/thumbnail/:projectId",
    //     authMiddleware.authenticateUser,
    //     collabMiddleware.isCollab,
    //     S3Manager.postSourceProductThumbnail);
}