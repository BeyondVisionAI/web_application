const { Schema, model } = require("mongoose");

const projectListed = new Schema({
    projectId: {
        type: Schema.Types.ObjectId,
        ref: "Project",
        required: true
    },
    listId: {
        type: Schema.Types.ObjectId,
        ref: "List",
        required: true
    }
});

exports.ProjectListed = model("ProjectListed", projectListed);