module.exports = function (app) {
    // const scriptEdition = require("../Controllers/ScriptEdition/ScriptEdition.js");
    const replica = require("../Controllers/ScriptEdition/Replica.js")
    const replicaComments = require("../Controllers/ScriptEdition/ReplicaComments");
    const authMiddleware = require('../Controllers/User/authMiddleware');
    const collabMiddleware = require('../Controllers/Collaboration/collabMiddleware');
    const ReplicaMiddleware = require('../Controllers/ScriptEdition/ReplicaMiddleware');

    /*
    ** Replicas Routes
    */


    app.get("/projects/:projectId/replicas",
        authMiddleware.authenticateUser,
        collabMiddleware.isCollab,
        replica.getProjectReplicas,
    );

    app.get("/projects/:projectId/replicas/:replicaId",
        authMiddleware.authenticateUser,
        collabMiddleware.isCollab,
        ReplicaMiddleware.isReplicaFromProject,
        replica.getProjectReplica,
    );

    app.post('/projects/:projectId/setReplicas',
        //TODO : a implementer
        //authMiddleware.authenticateUser,
        //collabMiddleware.isCollab,
        replica.setReplicas,
    );
    
    app.post("/projects/:projectId/replicas",
        authMiddleware.authenticateUser,
        collabMiddleware.hasRightWrite,
        replica.createReplica,
    );

    app.put("/projects/:projectId/replicas/:replicaId",
        authMiddleware.authenticateUser,
        collabMiddleware.hasRightWrite,
        ReplicaMiddleware.isReplicaFromProject,
        replica.updateReplica,
    );

    app.delete("/projects/:projectId/replicas/:replicaId",
        authMiddleware.authenticateUser,
        collabMiddleware.hasRightWrite,
        ReplicaMiddleware.isReplicaFromProject,
        replica.deleteReplica,
    );

    /*
    ** Replica Comments Routes
    */

    app.get("/projects/:projectId/replicas/:replicaId/comments",
        authMiddleware.authenticateUser,
        collabMiddleware.isCollab,
        ReplicaMiddleware.isReplicaFromProject,
        replicaComments.getReplicaComments,
    );

    app.get("/projects/:projectId/replicas/:replicaId/comments/:commentId",
        authMiddleware.authenticateUser,
        collabMiddleware.isCollab,
        ReplicaMiddleware.isReplicaFromProject,
        replicaComments.getReplicaComment,
    );

    app.post("/projects/:projectId/replicas/:replicaId/comments",
        authMiddleware.authenticateUser,
        collabMiddleware.hasRightWrite,
        ReplicaMiddleware.isReplicaFromProject,
        replicaComments.postComment,
    );

    app.delete("/projects/:projectId/replicas/:replicaId/comments/:commentId",
        authMiddleware.authenticateUser,
        collabMiddleware.hasRightOwner,
        ReplicaMiddleware.isReplicaFromProject,
        replicaComments.deleteComment,
    );
}