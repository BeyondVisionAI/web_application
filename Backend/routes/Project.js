module.exports = function(app) {
    const Project = require('../Controllers/Project/Project')
    const authMiddleware = require('../Controllers/User/authMiddleware')
    const collabMiddleware = require('../Controllers/Collaboration/collabMiddleware');

    app.get('/projects/:projectId', 
        authMiddleware.authenticateUser,
        collabMiddleware.isCollab,
        Project.getProject);

    app.post('/projects', 
        authMiddleware.authenticateUser, 
        Project.createProject);

    app.delete('/projects/:projectId', 
        authMiddleware.authenticateUser,
        collabMiddleware.hasRightOwner,
        Project.deleteProject);

    app.patch('/projects/:projectId', 
        authMiddleware.authenticateUser,
        collabMiddleware.hasRightAdmin,
        Project.updateProject);

    app.get('/projects', 
        authMiddleware.authenticateUser,
        Project.getAllProjects);
}