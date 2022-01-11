const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
    projectName: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Error', 'Stop', 'InProgress', 'Done'],
        default: 'Stop',
        required: true
    },
    videoUrl: {
        type: String,
        required: false
    },
    script: {
        type: String,
        required: false
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    assignedAudioDescriptiors: [{
        type: Schema.Types.ObjectId,
        ref: "User",
        required: false
    }]
});

exports.Project = mongoose.model('Project', projectSchema);