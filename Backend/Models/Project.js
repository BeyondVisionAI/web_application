const mongoose = require("mongoose");

const project = new mongoose.Schema({
    name: String,
    status: {
        type: String,
        enum: ['Error', 'Stop', 'InProgress', 'Done'],
        default: 'Stop',
        required: true
    },
    thumbnailId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Image",
      required: true
    },
    description: String,
    videoLink: String,
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    assignedAudioDescriptiors: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false
    }],
    script: {
        type: String,
        required: false
    },
});

exports.Project = mongoose.model("Project", project);