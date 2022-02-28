module.exports = function(app) {
    // const scriptEdition = require("../Controllers/ScriptEdition/ScriptEdition.js");
    const replica =  require("../Controllers/ScriptEdition/Replica.js")
    const replicaComments = require("../Controllers/ScriptEdition/ReplicaComments");
    const authMiddleware = require('../Controllers/User/authMiddleware');
    const collabMiddleware = require('../Controllers/Collaboration/collabMiddleware');

    /*
    ** Replicas Routes
    */


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

    /*
    ** Replica Comments Routes
    */

    app.get("/projects/:projectId/replicas/:replicaId/comments",
        authMiddleware.authenticateUser,
        collabMiddleware.isCollab,
        replicaComments.getReplicaComments);

    app.get("/projects/:projectId/replicas/:replicaId/comments/:commentId",
        authMiddleware.authenticateUser,
        collabMiddleware.isCollab,
        replicaComments.getReplicaComment);
    
    app.post("/projects/:projectId/replicas/:replicaId/comments",
        authMiddleware.authenticateUser,
        collabMiddleware.hasRightWrite,
        replicaComments.postComment);
    
    app.delete("/projects/:projectId/replicas/:replicaId/comments/:commentId",
        authMiddleware.authenticateUser,
        collabMiddleware.hasRightOwner,
        replicaComments.deleteComment);
}