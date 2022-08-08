const { model, Schema } = require("mongoose");

const ITEMTYPE = [
    'AUDIODESCRIPTOR',
    'CORRECTOR'
];

const task = new Schema({
    employee: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    projectId: {
        type: Schema.Types.ObjectId,
        ref: "Project",
        required: true
    },
    description: String,
    type: {
        type: String,
        enum: ITEMTYPE,
        required: true
    },
    employeeValidate: {
        type: Schema.Types.Boolean,
        default: false,
        required: true
    },
    clientValidate: {
        type: Schema.Types.Boolean,
        default: false,
        required: true
    }
});

exports.ITEMTYPE = ITEMTYPE;
exports.GENRE = GENRE;
exports.LANGUAGE = LANGUAGE;
exports.Item = model("Task", task);