module.exports = function(app) {
    const ProjectManager = require('../Controllers/Project/ProjectManager');

    app.route('/project/:projectID')
    .get(ProjectManager.getProject);

    app.route('/project/:projectID/descriptors')
    .put(ProjectManager.updateProjectDescriptors);
    app.route('/project/:projectID/script')
    .put(ProjectManager.updateProjectScript);
    app.route('/project/:projectID/status')
    .put(ProjectManager.updateProjectStatus);
    app.route('/project/:projectID')
    .put(ProjectManager.updateProject);

    app.route('/project')
    .post(ProjectManager.createProject)
    .delete(ProjectManager.deleteProjects);
}