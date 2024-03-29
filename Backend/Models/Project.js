const { model, Schema } = require("mongoose");

const enumStatus = [
    'Error',
    'Stop',
    'InProgress',
    'Done'
];
const enumActualStep = [
    'ProjectCreation',
    'ActionRetrieve',
    'FaceRecognition',
    'TextGeneration',
    'VoiceGeneration',
    'AudioGeneration',
    'VideoGeneration'
];

const project = new Schema({
    name: String,
    status: {
        type: String,
        enum: enumStatus,
        default: enumStatus[2],
        required: true
    },
    actualStep: {
        type: String,
        enum: enumActualStep,
        default: enumActualStep[1],
        required: true
    },
    progress: {
        type: Number,
        default: 100,
        required: false
    },
    thumbnailId: {
        type: Schema.Types.ObjectId,
        ref: "Image"
    },
    videoId: {
        type: Schema.Types.ObjectId,
        ref: "Video",
    },
    description: String,
    script: [{
        replica: String,
        lastEditor: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: false
        },
        required: false
    }],
});

exports.enumStatus = enumStatus;
exports.enumActualStep = enumActualStep;
exports.Project = model("Project", project);