const { Project } = require("../../Models/Project");

/**
 *
 * @param { projectName, status, videoUrl, script, creator, assignedAudioDescriptiors } req
 * @param {*} res
 * @returns { status: Number, message: String }
 */
exports.createProject = async function (req, res) {
    try {
        var newProject = new Project({
            projectName: req.body.projectName,
            status: req.body.status,
            videoUrl: req.body.videoUrl,
            script: req.body.script,
            creator: req.body.creator,
            assignedAudioDescriptiors: req.body.assignedAudioDescriptiors
        });
        newProject.save((err) => {
            if (err) return res.status(500).send(`Error while saving the project: ${err}`);
            return res.status(200).send("Project successfully created");
        });
    } catch (error) {
        if (error) {
            console.error(`Error while saving the project: ${error}`);
            res.status(500).send(`Error while saving the project: ${error}`);
        }
    }
}

/**
 *
 * @param { projectID, status } req
 * @param {*} res
 * @returns { status: Number, message: String }
 */
 exports.updateProjectStatus = async function (req, res) {
    try {
        Project.updateOne({
            _id: req.body.projectID,
        },
        {
            status: req.body.status,
        },
        (err, wr) => {
            if (err) return res.status(500).send(`Error while updating the project status: ${err}`);
            if (wr.modifiedCount === 0) return res.status(204).send(`User ${req.body.userID} isn't in the project ${req.body.projectID}`);
            return res.status(200).send(wr);
        });
    } catch (error) {
        if (err) {
            console.error(`Error while updating the project status: ${error}`);
            res.status(500).send(`Error while updating the project status: ${err}`);
        }
    }
}

/**
 *
 * @param { projectID, projectName, videoUrl, assignedAudioDescriptiors } req
 * @param {*} res
 * @returns { status: Number, message: String }
 */
 exports.updateProject = async function (req, res) {
    try {
        Project.updateOne({
            _id: req.body.projectID,
        },
        {
            projectName: req.body.projectName,
            videoUrl: req.body.videoUrl,
            assignedAudioDescriptiors: req.body.assignedAudioDescriptiors
        },
        (err, wr) => {
            if (err) return res.status(500).send(`Error while updating the project: ${err}`);
            if (wr.modifiedCount === 0) return res.status(204).send(`User ${req.body.userID} isn't in the project ${req.body.projectID}`);
            return res.status(200).send(wr);
        });
    } catch (error) {
        if (err) {
            console.error(`Error while updating the project: ${error}`);
            res.status(500).send(`Error while updating the project: ${err}`);
        }
    }
}

/**
 *
 * @param { projectID, script } req
 * @param {*} res
 * @returns { status: Number, message: String }
 */
 exports.updateProjectScript = async function (req, res) {
    try {
        Project.updateOne({
            _id: req.body.projectID,
        },
        {
            script: req.body.script,
        },
        (err, wr) => {
            if (err) return res.status(500).send(`Error while updating the project script: ${err}`);
            if (wr.modifiedCount === 0) return res.status(204).send(`User ${req.body.userID} isn't in the project ${req.body.projectID}`);
            return res.status(200).send(wr);
        });
    } catch (error) {
        if (err) {
            console.error(`Error while updating the project script: ${error}`);
            res.status(500).send(`Error while updating the project script: ${err}`);
        }
    }
}

/**
 *
 * @param { projectID, assignedAudioDescriptiors  } req
 * @param {*} res
 * @returns { status: Number, message: String }
 */
 exports.updateProjectDescriptors = async function (req, res) {
    try {
        Project.updateOne({
            _id: req.body.projectID,
        },
        {
            assignedAudioDescriptiors: req.body.assignedAudioDescriptiors
        },
        (err, wr) => {
            if (err) return res.status(500).send(`Error while updating the project descriptors: ${err}`);
            if (wr.modifiedCount === 0) return res.status(204).send(`User ${req.body.userID} isn't in the project ${req.body.projectID}`);
            return res.status(200).send(wr);
        });
    } catch (error) {
        if (err) {
            console.error(`Error while updating the project descriptors: ${error}`);
            res.status(500).send(`Error while updating the project descriptors: ${err}`);
        }
    }
}

/**
 *
 * @param { projectID } req
 * @param {*} res
 * @returns { [{ _id, projectName, status, videoUrl, script, creator, assignedAudioDescriptiors }] }
 */
exports.getProject = async function (req, res) {
    try {
        Project.find({ _id: req.params.projectID }, (err, docs) => {
            if (err) return res.status(500).send(`Error while fetching the database: ${err}`);
            if (docs.length === 0) return res.status(204).send("No project");
            return res.status(200).send(docs);
        });
    } catch (error) {
        console.error(`Error while fetching the project: ${error}`);
        res.status(500).send(`Error while fetching the database: ${error}`);
    }
}

/**
 *
 * @param { projectIDs: String[] } req
 * @param {*} res
 * @returns { status: Number }
 */

exports.deleteProjects = async function (req, res) {
    try {
        Project.deleteMany({ _id: { $in: req.body.projectIDs }}, (err, result) => {
            if (err) return res.status(500).send(`Error while deleting projects: ${err}`);
            if (result.deletedCount === 0) return res.status(204).send("No project");
            return res.status(200).send(result);
        });
    } catch (error) {
        console.error(`Error while deleting the projects: ${error}`);
        res.status(500).send(`Error while deleting projects: ${error}`);
    }
    // TODO: Delete the video thanks videoUrl
}