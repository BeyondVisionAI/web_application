const { Project } = require("../../Models/Project");
const { Replica } = require("../../Models/ScriptEdition/Replica");
const { Errors } = require("../../Models/Errors");

/**
 * Middleware to check if a replica belongs to the given project
 */

exports.isReplicaFromProject = async function(req, res, next) {
    try {
        var project = await Project.findById(req.params.projectId);
        var replica = await Replica.findById(req.params.replicaId);
        if (!replica) {
            console.log("ReplicaMiddleware/isReplicaFromProject -> No Replica found");
            return res.status(404).send(Errors.REPLICA_NOT_FOUND);
        }

        if (replica.projectId != req.params.projectId) {
            console.log("ReplicaMiddleware/isReplicaFromProject -> Replica's ProjectId does not correspond to the given project.");
            return res.status(404).send(Errors.REPLICA_NOT_IN_PROJECT);
        }

        next();
    } catch (e) {
        console.log("ReplicaMiddleware/isReplicaFromProject -> Internal Error", e);
        return res.status(500).send(Errors.INTERNAL_ERROR);
    }
}