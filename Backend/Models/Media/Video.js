const { Schema, model } = require("mongoose");

const video = new Schema({
    name: String,
    desc: String,
    ETag: String,
    url: String,
    status: {
        type: String,
        enum: ['Error', 'Posted', 'InProgress'],
        default: 'Error',
        required: true
    },
    progression: Number
});

exports.Video = model("Video", video);