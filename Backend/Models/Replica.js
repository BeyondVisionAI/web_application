const { model, Schema } = require("mongoose");

const replica = new Schema({
    index: Number,
    text: String,
    timestamp: Number,
    duration: Number,
    voiceId: String,
    lastEditor: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: false
    },
    lastEditDate: {
        date: Date,
        required: false
    },
    required: false
});

exports.Replica = model("Replica", replica);