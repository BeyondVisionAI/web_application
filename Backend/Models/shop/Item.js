const { Schema } = require("mongoose");

const itemType = [
    'Audiodescriptor',
    'Corrector'
];

const sexe = [
    'Male',
    'Female'
];

const item = new Schema({
    name: String,
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    actualStep: {
        type: String,
        enum: itemType,
        required: true
    },
    sexe: {
        type: String,
        enum: sexe,
        required: false
    },
    price: {
        type: Number,
        required: true
    },
    language: {
        type: [String],
        required: true
    }
});

exports.itemType = itemType;
exports.sexe = sexe;
exports.Item = model("Item", item);