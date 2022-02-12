const { model, Schema } = require("mongoose");
const Replica = require("Replica");

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
    description: String,
    videoLink: String,
    script: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Replica"
    }],
});

exports.Project = model("Project", project);