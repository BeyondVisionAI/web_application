const { Project } = require("../../Models/Project");
const { Replica } = require("../../Models/ScriptEdition/Replica");


exports.createReplicaInProjectDB = async function(mongoose, projectId,
    editor, content, timestamp = 0, duration = 1000, voiceId = 0) {
        const replica = new Replica({
            projectId: projectId,
            content: content,
            timestamp: timestamp,
            duration: duration,
            voiceId: voiceId,
            lastEditor: editor,
            lastEditDate: new Date()
        }).save();
        return replica;
}

