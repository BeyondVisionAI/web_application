const {model, Schema } = require("mongoose");
const Comment = require('./ReplicaComment');

const replicaComment = new Schema({
    replicaId: {
        type: Schema.Types.ObjectId,
        ref: "Replica",
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    date: Date,
    content: String
});

exports.ReplicaComment = model("ReplicaComment", replicaComment);