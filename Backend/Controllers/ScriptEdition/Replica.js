const { Project } = require("../../Models/Project");
const { Errors } = require("../../Models/Errors.js");
const { Replica } = require("../../Models/Replica");



exports.createReplica(req, res) = async function(req, res) {
    try {
        var project = Project.findById(req.params.projectId);
        if (!project) // check if project exists
            return res.status(404).send(Errors.PROJECT_NOT_FOUND);
        
        // sends all the new values thru the request body
        const newReplica = new Replica({
            projectId: req.params.projectId,
            content: req.body.content,
            timestamp: req.body.timestamp,
            duration: req.body.duration,
            voiceId: req.body.voiceId,
            lastEditor: req.body.lastEditor,
            lastEditDate: new Date()
        });

        await newReplica.save();
        res.status(200).send(newReplica);
    } catch (err) {
        console.log("Replica->createReplica : " + err);
        return res.status(500).send(Errors.INTERNAL_ERROR);
    }
}


exports.updateReplica(req, res) = async function(req, res) {
    try {
        let replica = await Replica.findById(req.params.replicaId);
        // does this ^^^ works as well as the Project.findById? I never define a replica by its own ID
        let hasChanged = false;

        if (req.body.content && req.body.content != replica.content) {
            replica.content = req.body.content;
            hasChanged = true;
        }
        if (req.body.timestamp && req.body.timestamp != replica.timestamp) {
            replica.timestamp = req.body.timestamp;
            hasChanged = true;
        }
        if (req.body.duration && req.body.duration != replica.duration) {
            replica.duration = req.body.duration;
            hasChanged = true;
        }
        if (req.body.voiceId && req.body.voiceId != replica.voiceId) {
            replica.voiceId = req.body.voiceId;
            hasChanged = true;
        }
        if (req.body.lastEditor && req.body.lastEditor != replica.lastEditor) {
            replica.lastEditor = req.body.lastEditor;
            hasChanged = true;
        }
        if (hasChanged) {
            replica.lastEditDate = new Date();
            await replica.save();
        }
        return res.status(200).send(replica);
    } catch (err) {
        console.log("Replica->updateReplica : " + err);
        return res.statuts(500).send(Errors.INTERNAL_ERROR);
    }
}



exports.deleteReplica(req, res) = async function(req, res) {
    try {
        var replicaToDelete = await Replica.findById(req.params.replicaId);
        if (!replicaToDelete)
            return res.status(404).send(Errors.REPLICA_NOT_FOUND);
        var isDeleted = await replicaToDelete.deleteOne();

        // if (!isDeleted) // check if a replica is correctly created
            
    } catch (err) {
        console.log("Replica->deleteReplica : " + err);
        return res.status(500).send(Errors.INTERNAL_ERROR);
    }
}