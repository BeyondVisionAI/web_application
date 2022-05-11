const { cp } = require("fs");
const { Errors } = require("../../Models/Errors");
const { Replica } = require("../../Models/ScriptEdition/Replica");
const { ReplicaComment } = require("../../Models/ScriptEdition/ReplicaComment");


exports.getReplicaComments = async function(req, res) {
    try {
        var comments = await ReplicaComment.find({replicaId: req.params.replicaId})
            .populate({path: "author", select: 'firstName lastName'})
            .sort({date: "asc"});
        res.status(200).send(comments);
    } catch (err) {
        console.log("ReplicaComment->getReplicaComments : " + err);
        return res.status(500).send(Errors.INTERNAL_ERROR);
    }
}


exports.getReplicaComment = async function(req, res) {
    try {
        var comment = await ReplicaComment.findById(req.params.commentId)
            .populate({path: "author", select: 'firstName lastName'});
        res.status(200).send(comment);
    } catch (err) {
        console.log("ReplicaComment->getReplicaComment : " + err);
        return res.status(500).send(Errors.INTERNAL_ERROR);
    }
}


exports.postComment = async function(req, res) {
    try {
        if (!req.body.content)
            return res.status(400).send(Errors.BAD_REQUEST_MISSING_INFOS);
        else if (await Replica.findById(req.params.replicaId) == null)
            return res.status(404).send(Errors.REPLICA_NOT_FOUND);
        
        const newComment = new ReplicaComment({
            replicaId: req.params.replicaId,
            author: req.user.userId,
            date: Date.now(),
            content: req.body.content
        });

        await newComment.save();
        res.status(200).send(newComment);
    } catch (err) {
        console.log("ReplicaComment->postComment : " + err);
        return res.status(500).send(Errors.INTERNAL_ERROR);
    }
}


exports.deleteComment = async function(req, res) {
    try {
        var commentToDelete = await ReplicaComment.findById(req.params.commentId);
        if (!commentToDelete)
            return res.status(404).send(Errors.REPLICACOMMENT_NOT_FOUND);
        await commentToDelete.deleteOne();

        return res.status(200).send("Success");
    } catch (err) {
        console.log("ReplicaComment->deleteComment : " + err);
        return res.status(500).send(Errors.INTERNAL_ERROR);
    }
}

// meant to be used as a clean way to organise the cascade deletion of item in the db
// doesn't work yet
exports.deleteCommentsByReplicaId = async function(req, res) {
    try {
        var commentsDeleted = await ReplicaComment.deleteMany({replicaId: req.params.replicaId});
        console.log(`${commentsDeleted} comments have been removed from the DB following a replica's removal.`);
        return res.status(200).send("Success");
    } catch (err) {
        console.log("ReplicaComment->deleteCommentsByReplicaId : " + err);
        return res.status(500).send(Errors.INTERNAL_ERROR);
    }
}