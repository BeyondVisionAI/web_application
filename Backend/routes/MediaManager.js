module.exports = function (app) {
    const authMiddleware = require('../Controllers/User/authMiddleware');
    const collabMiddleware = require('../Controllers/Collaboration/collabMiddleware');
    const mediaManager = require("../Controllers/MediaManager/MediaManager");

    /*
    ** MediaManager Routes
    */
    app.post('/mediaManager/:operationType/:objectType',
        // authMiddleware.authenticateUser,
        // collabMiddleware.isCollab,
        mediaManager.getSignedUrl);
}