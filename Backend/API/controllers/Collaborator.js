const controllers = require("../../models/Collaborator");


/**
 *
 * @param { userID, projectID, canWrite, canRead, canDownload } req
 * @param {*} res
 * @returns { status: Number, message: String }
 */
exports.createCollaborator = async function (req, res) {
    try {
        var newCollaborator = new controllers.Collaborator({
            userID: req.body.userID,
            projectID: req.body.projectID,
            canWrite: req.body.canWrite,
            canRead: req.body.canRead,
            canDownload: req.body.canDownload
        });
        newCollaborator.save((err) => {
            if (err) return res.status(500).send(`Error while saving the collaborator: ${err}`);
            return res.status(200).send("Collaborator successfully created");
        });
    } catch (error) {
        if (error) {
            console.error(`Error while saving the collaborator: ${error}`);
            res.status(500).send(`Error while saving the collaborator: ${error}`);
        }
    }
}

/**
 *
 * @param { userID, projectID, canWrite, canRead, canDownload } req
 * @param {*} res
 * @returns { status: Number, message: String }
 */
 exports.updateCollaborator = async function (req, res) {
    try {
        controllers.Collaborator.updateOne({
            userID: req.body.userID,
            projectID: req.body.projectID
        },
        {
            canWrite: req.body.canWrite,
            canRead: req.body.canRead,
            canDownload: req.body.canDownload
        },
        (err, wr) => {
            if (err) return res.status(500).send(`Error while updating the collaborator: ${err}`);
            if (wr.modifiedCount === 0) return res.status(204).send(`User ${req.body.userID} isn't in the project ${req.body.projectID}`);
            return res.status(200).send(wr);
        });
    } catch (error) {
        if (err) {
            console.error(`Error while updating the collaborator: ${error}`);
            res.status(500).send(`Error while updating the collaborator: ${err}`);
        }
    }
}


/**
 *
 * @param { projectID: projectID } req
 * @param {*} res
 * @returns { [{ _id, userID, projectID, canWrite, canRead, canDownload }] }
 */
exports.getCollaborators = async function (req, res) {
    try {
        controllers.Collaborator.find({ projectID: req.params.projectID }, (err, docs) => {
            if (err) return res.status(500).send(`Error while fetching the database: ${err}`);
            if (docs.length === 0) return res.status(204).send("No collaborator");
            return res.status(200).send(docs);
        });
    } catch (error) {
        console.error(`Error while fetching the collaborator: ${error}`);
        res.status(500).send(`Error while fetching the database: ${error}`);
    }
}


/**
 *
 * @param { 'userIDs': String[], 'projectIDs': String[] } req
 * @param {*} res
 * @returns { status: Number }
 */

exports.deleteCollaborators = async function (req, res) {
    try {
        controllers.Collaborator.deleteMany({ userID: { $in: req.body.userIDs }, projectID: { $in: req.body.projectIDs }}, (err, result) => {
            if (err) return res.status(500).send(`Error while deleting collaborators: ${err}`);
            if (result.deletedCount === 0) return res.status(204).send("No collaborator");
            return res.status(200).send(result);
        });
    } catch (error) {
        console.error(`Error while deleting the collaborators: ${error}`);
        res.status(500).send(`Error while deleting collaborators: ${error}`);
    }
}