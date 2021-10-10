const controllers = require("../../models/Collaborator");


/**
 *
 * @param { userID, projectID, canWrite, canRead, canDownload } req
 * @param {*} res
 * @returns { status: Number, message: String }
 */
exports.createCollaborator = async function (req, res) {
    console.log("__ Create Collaborator __");
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
        if (error) return res.status(500).send(`Error while saving the collaborator: ${error}`);
    }
}

/**
 *
 * @param { userID, projectID, canWrite, canRead, canDownload } req
 * @param {*} res
 * @returns { status: Number, message: String }
 */
 exports.updateCollaborator = async function (req, res) {
    console.log("__ Update Collaborator __");

    try {
        controllers.Collaborator.update({
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
            return res.status(200).send(wr);
        });
    } catch (error) {
        if (err) return res.status(500).send(`Error while updating the collaborator: ${err}`);
    }
}


/**
 *
 * @param { projectID: projectID } req
 * @param {*} res
 * @returns { [{ userID, projectID, canWrite, canRead, canDownload }] }
 */
exports.getCollaborators = async function (req, res) {
    console.log("__ Get Collaborators __");

    try {
        controllers.Collaborator.find({projectID: req.body.projectID}, (err, docs) => {
            if (err) return res.status(500).send(`Error while fetching the database: ${err}`);
            if (docs.length === 0) return res.status(204).send("No collaborator");
            return res.status(200).send(docs);
        });
    } catch (error) {
        res.status(500).send(`Error while fetching the database: ${error}`);
    }
}


/**
 *
 * @param { collaborators: [{ 'userID': userID, 'projectID': projectID }] } req
 * @param {*} res
 * @returns { status: Number }
 */

exports.deleteCollaborators = async function (req, res) {
    console.log("__ Delete Collaborators __");

    try {
        controllers.Collaborator.deleteMany(req.body.collaborators, (err, deletedCount) => {
            if (err) return res.status(500).send(`Error while deleting collaborators: ${err}`);
            if (!deletedCount) return res.status(204).send("No collaborator");
            return res.status(200);
        });
    } catch (error) {
        res.status(500).send(`Error while deleting collaborators: ${error}`);
    }
}