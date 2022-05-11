const mongoose = require("mongoose");

const projectListed = new mongoose.Schema({
    projectId: String,
    listId: String
});

exports.ProjectListed = mongoose.model("ProjectListed", projectListed);