module.exports = function(app) {
  const Test = require('../API/Test/TestServer.js');
  const Collaborator = require('../API/controllers/Collaborator');

  app.route('/api/test')
  .get(Test.testServer)

  /**
   * Collaborator
   */

  app.route('/api/collaborator')
    .get(Collaborator.getCollaborators)
    .post(Collaborator.createCollaborator)
    .put(Collaborator.updateCollaborator)
    .delete(Collaborator.deleteCollaborators);
}