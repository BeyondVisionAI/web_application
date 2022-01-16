const mongoose = require("mongoose");

const script = new mongoose.Schema({
    projectID: 
    {
        type: Schema.Types.ObjectId,
        ref: "Project",
        required: true
    },
    // userId: String,
    content: [{
        replica: String,
        lastEditor: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        required: false
    }]
});

exports.ScriptEdition = mongoose.model("ScriptEdition", script);