const { Errors } = require("../../Models/Errors.js");
const { Replica } = require("../../Models/ScriptEdition/Replica");
const { ReplicaComment } = require("../../Models/ScriptEdition/ReplicaComment.js");

createAudio = async (replica) => {
    try {
        const response = await fetch(`${process.env.SERVER_IA_URL}/Voice/TextToSpeech`, {
            method: 'post',
            body: JSON.stringify({
                projectId: replica.projectId,
                voiceId: replica.voiceId,
                text: replica.text,
                replicaId: replica._id
            })
        });
        switch (response.status) {
            case 200:
                return true;
            case 400:
                throw Errors(response)
            default:
                break;
        }
    } catch(error) {
        console.error(error);
    }
}

exports.getProjectReplicas = async function(req, res) {
    try {
        // var script = await Replica.find({projectId: req.params.projectId}).sort({timestamp: "asc"});
        var script = await Replica.find({projectId: req.params.projectId}).
            populate({path: 'lastEditor', select: 'firstName lastName'}).
            sort({timestamp: "asc"});
        // TODO: Ajout de l'url lors de la récupération
        // Si l'url n'est pas dispo mettre un message en front et faire un systeme de refresh
        res.status(200).send(script);
    } catch (err) {
        console.log("Replica->getProjectReplicas : " + err);
        return res.status(500).send(Errors.INTERNAL_ERROR);
    }
}


exports.getProjectReplica = async function(req, res) {
    try {
        var replica = await Replica.findById(req.params.replicaId).
            populate({path: 'lastEditor', select: 'firstName lastName'});
            // TODO: Ajout de l'url lors de la récupération
            // Si l'url n'est pas dispo mettre un message en front et faire un systeme de refresh
        res.status(200).send(replica);
    } catch (err) {
        console.log("Replica->getProjectReplica : " + err);
        return res.status(500).send(Errors.INTERNAL_ERROR);
    }
}


exports.createReplica = async function(req, res) {
    try {
        if (req.body.content !== '' || !req.body.timestamp || !req.body.duration
            || !req.body.voiceId) {
            return res.status(400).send(Errors.BAD_REQUEST_MISSING_INFOS);
        }

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
        createAudio(newReplica);
        res.status(200).send(newReplica);
    } catch (err) {
        console.log("Replica->createReplica : " + err);
        return res.status(500).send(Errors.INTERNAL_ERROR);
    }
}


exports.updateReplica = async function(req, res) {
    try {
        let replica = await Replica.findById(req.params.replicaId);
        let hasChanged = false;
        let needAudioChanged = false;

        if (req.body.content && req.body.content != replica.content) {
            replica.content = req.body.content;
            needAudioChanged = true;
            hasChanged = true;
        }
        if (req.body.timestamp && req.body.timestamp != replica.timestamp) {
            replica.timestamp = req.body.timestamp;
            hasChanged = true;
        }
        if (req.body.duration && req.body.duration != replica.duration) {
            replica.duration = req.body.duration;
            needAudioChanged = true
            hasChanged = true;
        }
        if (req.body.voiceId && req.body.voiceId != replica.voiceId) {
            replica.voiceId = req.body.voiceId;
            needAudioChanged = true;
            hasChanged = true;
        }
        if (hasChanged) {
            replica.lastEditDate = new Date();
            replica.lastEditor = req.user.userId;
            await replica.save();
            if (needAudioChanged) {
               createAudio(replica);
            }
        }
        return res.status(200).send(replica);
    } catch (err) {
        console.log("Replica->updateReplica : " + err);
        return res.status(500).send(Errors.INTERNAL_ERROR);
    }
}


exports.deleteReplica = async function(req, res) {
    try {
        // await ReplicaCommentController.deleteCommentsByReplicaId(req, res);
        var replicaToDelete = await Replica.findById(req.params.replicaId);
        if (!replicaToDelete) {
            return res.status(404).send(Errors.REPLICA_NOT_FOUND);
        }
        // TODO: Delete audio on s3
        await replicaToDelete.deleteOne();
        const attachedCommentsDeleted = await ReplicaComment.deleteMany({replicaId: req.params.replicaId});
        if (attachedCommentsDeleted > 0) console.log(`${attachedCommentsDeleted} comments deleted with the removed replica`);

        // Old way of cascade-removing attached comments to the targeted replica
        // const commentsToDelete = await ReplicaComment.find({replicaId: req.params.replicaId});
        // for (var comment of commentsToDelete)
        //     await comment.deleteOne();

        return res.status(200).send("Success");
    } catch (err) {
        console.log("Replica->deleteReplica : " + err);
        return res.status(500).send(Errors.INTERNAL_ERROR);
    }
}