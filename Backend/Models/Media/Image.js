const { Schema, model } = require("mongoose");

const image = new Schema({
    name: String,
    desc: String,
    ETag: String
});

exports.Image = model("Image", image);