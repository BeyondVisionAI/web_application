const { Schema, model } = require("mongoose");
const { Role } = require("./Roles.js");

const collaboration = new Schema({
    projectId: {
        type: Schema.Types.ObjectId,
        ref: "Project",
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    titleOfCollaboration: String,
    rights: {
        type: String,
        enum : Role,
        default: Role.ADMIN
    }
});

exports.Collaboration = model("Collaboration", collaboration);