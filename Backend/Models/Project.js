const mongoose = require("mongoose");

const project = new mongoose.Schema({
    name: String,
    lastEdit: Date,
    // status: Enum,
    imageId: String,
    description: String,
    videoLink: String,
    // script: ?
});

exports.Project = mongoose.model("Project", project);