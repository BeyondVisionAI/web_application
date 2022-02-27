const { Project } = require("../../Models/Project");
const { Errors } = require("../../Models/Errors.js");
const { Replica } = require("../../Models/Replica");


exports.getProjectReplicas = async function(req, res) {
    try {
        var script = await Replica.find({projectId: req.params.projectId});
        res.status(200).send(script);
    } catch (err) {
        console.log("Replica->getProjectReplicas : " + err);
        return res.status(500).send(Errors.INTERNAL_ERROR);
    }
}


exports.getProjectReplica = async function(req, res) {
    try {
        var replica = await Replica.findById(req.params.replicaId);
        res.status(200).send(replica);
    } catch (err) {
        console.log("Replica->getProjectReplica : " + err);
        return res.status(500).send(Errors.INTERNAL_ERROR);
    }
}


exports.createReplica = async function(req, res) {
    try {
        if (!req.body.content || !req.body.timestamp || !req.body.duration
            || !req.body.voiceId)
            return res.status(400).send(Errors.BAD_REQUEST_MISSING_INFOS);

        const newReplica = new Replica({
            projectId: req.params.projectId,
            content: req.body.content,
            timestamp: req.body.timestamp,
            duration: req.body.duration,
            voiceId: req.body.voiceId,
            lastEditor: req.user.userId,
            lastEditDate: Date.now()
        });

        await newReplica.save();
        res.status(200).send(newReplica);
    } catch (err) {
        console.log("Replica->createReplica : " + err);
        return res.status(500).send(Errors.INTERNAL_ERROR);
    }
}


exports.updateReplica = async function(req, res) {
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
        if (hasChanged) {
            replica.lastEditDate = new Date();
            replica.lastEditor = req.user.userId;
            await replica.save();
        }
        return res.status(200).send(replica);
    } catch (err) {
        console.log("Replica->updateReplica : " + err);
        return res.status(500).send(Errors.INTERNAL_ERROR);
    }
}


exports.deleteReplica = async function(req, res) {
    try {
        var replicaToDelete = await Replica.findById(req.params.replicaId);
        if (!replicaToDelete)
            return res.status(404).send(Errors.REPLICA_NOT_FOUND);
        var isDeleted = await replicaToDelete.deleteOne();

        // if (!isDeleted) // check if a replica is correctly created
        return res.status(200).send("Success");
    } catch (err) {
        console.log("Replica->deleteReplica : " + err);
        return res.status(500).send(Errors.INTERNAL_ERROR);
    }
}