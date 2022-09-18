module.exports = function (app) {
    const S3Manager = require("../Controllers/S3Manager/S3Manager")
    const authMiddleware = require('../Controllers/User/authMiddleware');
    const collabMiddleware = require('../Controllers/Collaboration/collabMiddleware');

    /*
    ** S3Manager Routes
    */

    app.get("/S3Manger/finished-product/video/download-url/:projectId",
        authMiddleware.authenticateUser,
        collabMiddleware.isCollab,
        S3Manager.getDownloadUrlFinishedProductVideo);


    // app.get("/S3Manger/finished-product/video/:projectId",
    //     authMiddleware.authenticateUser,
    //     collabMiddleware.isCollab,
    //     S3Manager.getFinishedProductVideo);

    app.get("/S3Manger/finished-product/audio/download-url/:projectId",
        authMiddleware.authenticateUser,
        collabMiddleware.isCollab,
        S3Manager.getDownloadUrlFinishedProductAudio);

    // app.get("/S3Manger/finished-product/audio/:projectId",
    //     authMiddleware.authenticateUser,
    //     collabMiddleware.isCollab,
    //     S3Manager.getFinishedProductAudio);

    app.get("/S3Manger/source-product/video/download-url/:projectId/:name",
        authMiddleware.authenticateUser,
        collabMiddleware.isCollab,
        S3Manager.getDownloadUrlSourceProductVideo);

    app.get("/S3Manger/source-product/video/upload-url/:projectId/:name",
        authMiddleware.authenticateUser,
        collabMiddleware.isCollab,
        S3Manager.getUploadUrlSourceProductVideo);

    // app.post("/S3Manger/source-product/video/:projectId",
    //     authMiddleware.authenticateUser,
    //     collabMiddleware.isCollab,
    //     S3Manager.postSourceProductVideo);

    app.get("/S3Manger/source-product/thumbnail/download-url/:projectId/:name",
        authMiddleware.authenticateUser,
        collabMiddleware.isCollab,
        S3Manager.getDownloadUrlSourceProductThumbnail);

    app.get("/S3Manger/source-product/thumbnail/upload-url/:projectId/:name",
        authMiddleware.authenticateUser,
        collabMiddleware.isCollab,
        S3Manager.getUploadUrlSourceProductThumbnail);

    // app.post("/S3Manger/source-product/thumbnail/:projectId",
    //     authMiddleware.authenticateUser,
    //     collabMiddleware.isCollab,
    //     S3Manager.postSourceProductThumbnail);
}