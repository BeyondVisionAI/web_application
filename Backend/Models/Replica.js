const { model, Schema } = require("mongoose");

const replica = new Schema({
    projectId: {
        type: Schema.Types.ObjectId,
        ref: "Project",
        required: true
    },
    content: String,
    timestamp: Number,
    duration: Number,
    voiceId: String,
    comments: [String],
    /*
    comments: [
        author: {
            type: Schema.Types.OBjectId,
            ref: "User",
            required: true
        },
        date: Date,
        content: String
    ]
    */
    lastEditor: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    lastEditDate: Date
});

exports.Replica = model("Replica", replica);