const { Schema, model } = require("mongoose");

const video = new Schema({
    name: String,
    desc: String,
    ETag: String,
    url: String,
});

exports.Video = model("Video", video);