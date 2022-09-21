const { Schema, model } = require("mongoose");

const video = new Schema({
    name: String,
    desc: String,
    ETag: String,
    url: String,
    status: {
        type: String,
        enum: ['Default', 'Error', 'Posted', 'InProgress'],
        default: 'Default',
        required: true
    },
    progression: Number
});

exports.Video = model("Video", video);