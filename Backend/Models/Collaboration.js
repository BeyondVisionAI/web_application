const mongoose = require("mongoose");
const { Role } = require("./Roles.js");

const collaboration = new mongoose.Schema({
    projectId: String,
    userId: String,
    titleOfCollaboration: String,
    rights: {
        type: String,
        enum : Role,
        default: Role.ADMIN
    }
});

exports.Collaboration = mongoose.model("Collaboration", collaboration);