module.exports = function(app) {
    // const Auth = require('../Controllers/User/Auth')
    const Project = require('../Controllers/Project/Project')
    // const Middleware = require('../Controllers/User/authMiddleware')

    app.get('/projects/:projectId', Project.getProject);
    app.post('/projects', Project.createProject);
    app.delete('/projects/:projectId', Project.deleteProject);
    app.patch('/projects/:projectId', Project.updateProject);
}