const { model, Schema } = require("mongoose");

const ITEMTYPE = [
    'AUDIODESCRIPTOR',
    'CORRECTOR'
];

const GENRE = [
    'MALE',
    'FEMALE'
];

const LANGUAGE = [
    'FRENCH',
    'ENGLISH',
    'SPANISH',
    'GERMAN'
]

const item = new Schema({
    name: String,
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    type: {
        type: String,
        enum: ITEMTYPE,
        required: true
    },
    genre: {
        type: String,
        enum: GENRE,
        required: false
    },
    price: {
        type: Number,
        required: true
    },
    language: {
        type: [String],
        enum: LANGUAGE,
        required: true
    }
});

exports.ITEMTYPE = ITEMTYPE;
exports.GENRE = GENRE;
exports.LANGUAGE = LANGUAGE;
exports.Item = model("Item", item);