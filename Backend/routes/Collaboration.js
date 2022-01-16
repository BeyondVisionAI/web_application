module.exports = function(app) {
    const Collaboration = require("../Controllers/Collaboration/Collaboration");
    const authMiddleware = require("../Controllers/User/authMiddleware");
    const collabMiddleware = require("../Controllers/Collaboration/collabMiddleware");

    app.get('/projects/:projectId/collaborations', 
        authMiddleware.authenticateUser,
        collabMiddleware.isCollab, 
        Collaboration.getCollaborations);
    
    app.post('/projects/:projectId/collaborations',
        authMiddleware.authenticateUser,
        collabMiddleware.hasRightAdmin,
        Collaboration.createCollaboration);

    app.patch('/projects/:projectId/collaborations/:collabId',
        authMiddleware.authenticateUser,
        collabMiddleware.hasRightAdmin,
        Collaboration.updateCollaboration);

    app.delete('/projects/:projectId/collaborations/:collabId',
        authMiddleware.authenticateUser,
        collabMiddleware.hasRightAdmin,
        Collaboration.deleteCollaboration);

    app.post('/projects/:projectId/leave',
        authMiddleware.authenticateUser,
        collabMiddleware.isCollab,
        Collaboration.leaveProject);
};