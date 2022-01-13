const mongoose = require("mongoose");
const { Role } = require("../Roles");

const listMember = new mongoose.Schema({
    listId: String,
    userId: String,
    rights: {
        type: String,
        enum: Role,
        default: Role.ADMIN
    }
});

exports.ListMember = mongoose.model("ListMember", listMember);