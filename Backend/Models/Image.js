const mongoose = require("mongoose");

const image = new mongoose.Schema({
    name: String,
    desc: String,
    imgId: String
});

exports.Project = mongoose.model("Image", image);