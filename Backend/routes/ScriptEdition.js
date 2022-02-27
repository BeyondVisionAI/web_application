module.exports = function(app) {
    // const scriptEdition = require("../Controllers/ScriptEdition/ScriptEdition.js");
    const replica =  require("../Controllers/ScriptEdition/Replica.js")
    const authMiddleware = require('../Controllers/User/authMiddleware');
    const collabMiddleware = require('../Controllers/Collaboration/collabMiddleware');

    app.get("/projects/:projectId/replicas",
        authMiddleware.authenticateUser,
        collabMiddleware.isCollab,
        replica.getProjectReplicas);

    app.get("/projects/:projectId/replicas/:replicaId",
        authMiddleware.authenticateUser,
        collabMiddleware.isCollab,
        replica.getProjectReplica);

    app.post("/projects/:projectId/replicas",
        authMiddleware.authenticateUser,
        collabMiddleware.hasRightWrite,
        replica.createReplica);

    app.put("/projects/:projectId/replicas/:replicaId",
        authMiddleware.authenticateUser,
        collabMiddleware.hasRightWrite,
        replica.updateReplica);

    app.delete("/projects/:projectId/replicas/:replicaId",
        authMiddleware.authenticateUser,
        collabMiddleware.hasRightWrite,
        replica.deleteReplica);
}