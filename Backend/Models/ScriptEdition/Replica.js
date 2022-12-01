const { model, Schema } = require("mongoose");

const enumStatus = [
    'Error',
    'Stop',
    'InProgress',
    'Done'
];

const enumActualStep = [
    'Created',
    'Updated',
    'Voice',
    'Removed'
];

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
    actualStep: {
        type: String,
        enum: enumActualStep,
        default: enumActualStep[1],
        required: true
    },
    status: {
        type: String,
        enum: enumStatus,
        default: enumStatus[2],
        required: true
    },
    lastEditor: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    lastEditDate: Date,
    audioName: String,
});



/**
 * I've spent hours trying to implement this middleware/hook/whateveritissuppposedtobecalled
 * without any success. I wanted to do a cascading delete, If you'd delete
 * a replica, it would also delete all the attached ReplicaComments by its ID,
 * but somehow it doesn't work
 * 
 * Note :
 * This kind of middleware might concerns "doc" elements (to me its a model), thats why the dictionary is here in 2ns argument
 * I think its important to keep its declaration before the model's compilation.
 * If the hook is 'remove', it will only be called when the 'remove' query is used (not deleteOne ie). Also, its deprecated...
 * Would be cool to implement it on the Project model asw, so if you delete a project, it deletes all the project's replicas.
 * That's what happens when I try to do good. I only harm myself and others and my mental state
 */
// replica.pre('remove', /*{query: true, document: false},*/ async function(next) {
//     console.log("remove fired");

//     var commentsDelete = await Comment.remove({replicaId: this._id});
//     console.log(commentsDelete);
//     next();
// });

exports.Replica = model("Replica", replica);