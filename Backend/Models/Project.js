const { model, Schema } = require("mongoose");
const Replica = require("Replica");

const project = new Schema({
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
    script: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Replica"
    }],
});

exports.Project = model("Project", project);