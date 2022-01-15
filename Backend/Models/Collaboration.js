const mongoose = require("mongoose");
const { Role } = require("./Roles.js");

const collaboration = new mongoose.Schema({
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

exports.Collaboration = mongoose.model("Collaboration", collaboration);