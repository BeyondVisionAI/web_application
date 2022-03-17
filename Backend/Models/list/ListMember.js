const { Schema, model } = require("mongoose");
const { Role } = require("../Roles");

const listMember = new Schema({
    listId: {
        type: Schema.Types.ObjectId,
        ref: "List",
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    rights: {
        type: String,
        enum: Role,
        default: Role.ADMIN
    }
});

exports.ListMember = model("ListMember", listMember);