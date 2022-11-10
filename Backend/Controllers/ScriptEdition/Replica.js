const { Errors } = require("../../Models/Errors.js");
const { Replica } = require("../../Models/ScriptEdition/Replica");
const { ReplicaComment } = require("../../Models/ScriptEdition/ReplicaComment.js");
const { deleteFileS3, DownloadFileUrl } = require("../MediaManager/MediaManager")
const axios = require("axios");

/**
 * Call ServerIA to create audio
 * @param {Replica} replica
 * @returns true or throw Error
 */
const createAudio = async (replica) => {
    try {
        const { projectId, voiceId, content, _id } = replica;
        if (content.length > 0) {
            replica.status = 'InProgress';
            replica.actualStep = 'Voice';
            await replica.save();
            let url = `${process.env.SERVER_IA_URL}/Voice/TextToSpeech`;
            axios.post(url, {
                projectId: projectId,
                voiceId: voiceId,
                text: content,
                replicaId: _id
            })
            .then((response) => {
                if (response.status != 200) {
                    throw Error(response.data);
                }
                replica.duration = response.data.audioDuration;
                replica.status = 'Done';
                replica.actualStep = 'Voice';
                replica.save();
            })
            .catch((err) => {
                replica.status = 'Error';
                replica.actualStep = 'Voice';
                replica.save();
                throw err;
            });
        } else {
            console.log('Replica content null');
        }
    } catch (error) {
        console.error("Replica->Create Audio :", error);
        return false;
    }
}

/**
 * Get download url and put in returned replica
 * @param {Replica} replica
 * @returns Replica + audio download url
 */
const getReplicaAudioUrl = async (replica) => {
    try {
        if (replica.status != 'Done' || replica.actualStep != 'Voice') {
            return replica
        }
        const url = await DownloadFileUrl('bv-replicas', `${replica.projectId}/${replica._id}.mp3`);

        return url
    } catch (error) {
        console.error(error);
    }
}

exports.getProjectReplicas = async function (projectId) {
    try {
        var script = await Replica.find({ projectId: projectId }).
            populate({ path: 'lastEditor', select: 'firstName lastName' }).
            sort({ timestamp: "asc" });

        let scriptWithUrls = []
        for(let replica in script) {
            if (replica) {
                scriptWithUrls.push({...script[replica]._doc, audioUrl: await getReplicaAudioUrl(script[replica])});
            }
        }

        return (scriptWithUrls);
    } catch (err) {
        console.log("Replica->getProjectReplicas : " + err);
        return (Errors.INTERNAL_ERROR);
    }
}

exports.getProjectReplicas = async function (req, res) {
    try {
        var script = await Replica.find({ projectId: req.params.projectId })
            .populate({ path: 'lastEditor', select: 'firstName lastName' })
            .sort({ timestamp: "asc" });
        let scriptWithUrls = []
        for(let replica in script) {
            if (replica) {
                scriptWithUrls.push({...script[replica]._doc, audioUrl: await getReplicaAudioUrl(script[replica])});
            }
        }

        res.status(200).send(scriptWithUrls);
    } catch (err) {
        console.log("Replica->getProjectReplicas : " + err);
        return res.status(500).send(Errors.INTERNAL_ERROR);
    }
}


exports.getProjectReplica = async function (req, res) {
    try {
        let replica = await Replica.findById(req.params.replicaId).
            populate({ path: 'lastEditor', select: 'firstName lastName' });
        let replicaWithUrl = {...replica._doc, audioUrl: await getReplicaAudioUrl(replica)};

        res.status(200).send(replicaWithUrl);
    } catch (err) {
        console.log("Replica->getProjectReplica : " + err);
        return res.status(500).send(Errors.INTERNAL_ERROR);
    }
}


exports.createReplica = async function (req, res) {
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
            actualStep: 'Created',
            status: 'Done',
            lastEditor: req.user.userId,
            lastEditDate: Date.now()
        });
        newReplica.audioName = `${newReplica.projectId}/${newReplica._id}.mp3`;

        await newReplica.save();
        await createAudio(newReplica);
        res.status(200).send(newReplica);
    } catch (err) {
        console.log("Replica->createReplica : " + err);
        return res.status(500).send(Errors.INTERNAL_ERROR);
    }
}


exports.updateReplica = async function (req, res) {
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
            replica.actualStep = 'Updated';
            replica.status = 'Done';
            replica.lastEditDate = new Date();
            replica.lastEditor = req.user.userId;
            await replica.save();
            if (needAudioChanged) {
                await createAudio(replica);
            }
        }
        return res.status(200).send(replica);
    } catch (err) {
        console.log("Replica->updateReplica : " + err);
        return res.status(500).send(Errors.INTERNAL_ERROR);
    }
}


exports.deleteReplica = async function (req, res) {
    try {
        // await ReplicaCommentController.deleteCommentsByReplicaId(req, res);
        var replicaToDelete = await Replica.findById(req.params.replicaId);
        if (!replicaToDelete) {
            return res.status(404).send(Errors.REPLICA_NOT_FOUND);
        }
        await deleteFileS3('bv-replicas', replicaToDelete.audioName);
        await replicaToDelete.deleteOne();
        const attachedCommentsDeleted = await ReplicaComment.deleteMany({ replicaId: req.params.replicaId });
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