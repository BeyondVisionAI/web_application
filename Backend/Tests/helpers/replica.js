const { Project } = require("../../Models/Project");
const { Replica } = require("../../Models/ScriptEdition/Replica");


exports.createReplicaInProjectDB = async function(mongoose, projectId,
    editorId, content, timestamp = 0, duration = 1000, voiceId = 0) {
        // const ed = mongoose.Types.ObjectId();
        const replica = new Replica({
            projectId: projectId,
            content: content,
            timestamp: timestamp,
            duration: duration,
            voiceId: voiceId,
            lastEditor: editorId,
            lastEditDate: Date.now()
        }).save();
        return replica;
}

