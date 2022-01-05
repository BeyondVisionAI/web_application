const mongoose = require("mongoose");
const { v4: uuidv4 } = require('uuid');

const project = new mongoose.Schema({
    id: mongoose.Types.ObjectId,
    name: String,
    lastEdit: Date,
    // status: Enum,
    imageId: String,
    description: String,
    videoLink: String,
    // script: ?
});

exports.Project = mongoose.model("Project", project);