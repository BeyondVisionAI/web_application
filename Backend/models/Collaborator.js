const mongoose = require('mongoose');

// userID: {
//     type: { type: mongoose.Schema.Types.ObjectId, ref: 'userID' },
//     required: true
// },
// projectID: {
//     type: { type: mongoose.Schema.Types.ObjectId, ref: 'projectID' },
//     required: true
// },

const collaboratorSchema = new mongoose.Schema({
    userID: {
        type: String,
        required: true
    },
    projectID: {
        type: String,
        required: true
    },
    canWrite: {
        type: Boolean,
        required: true
    },
    canRead: {
        type: Boolean,
        required: true
    },
    canDownload: {
        type: Boolean,
        required: true
    }
});

exports.Collaborator = mongoose.model('Collaborator', collaboratorSchema);