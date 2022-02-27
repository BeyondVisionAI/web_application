const { model, Schema } = require("mongoose");

const project = new Schema({
    name: String,
    status: {
        type: String,
        enum: ['Error', 'Stop', 'InProgress', 'Done'],
        default: 'Stop',
        required: true
    },
    thumbnailId: {
      type: Schema.Types.ObjectId,
      ref: "Image",
      required: true
    },
    videoId: {
        type: Schema.Types.ObjectId,
        ref: "Video",
        required: true
    },
    description: String,
    script: [{
        replica: String,
        lastEditor: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required : false
        },
        required: false
    }],
});

exports.Project = model("Project", project);