const { Project, enumStatus, enumActualStep } = require("../../Models/Project");
const Collaboration = require("../../Controllers/Collaboration/Collaboration");
const { Role } = require("../../Models/Roles");
const { Errors } = require("../../Models/Errors.js");
const { ProjectListed } = require("../../Models/list/ProjectListed");
const axios = require("axios")

exports.getProjectDB = async function (projectId) {
    try {
        var project = await Project.findById(projectId);
        return project;
    } catch (err) {
        console.log("Project->getProjectDB: " + err);
        return null;
    }
}

exports.getAllProjectsDB = async function (userId) {
    try {
        const collabs = await Collaboration.getAllCollaborationsDB(userId);
        var projects = [];
        for (const collab in collabs) {
            var project = await Project.findById(collabs[collab].projectId);
            if (project)
                projects.push(project);
            else
                console.log("Project->getAllProjectDB: Collab \"" + collabs[collab]._id + "\" is linked to a not existing projectId: " + collab.projectId);
        }
        return projects;
    } catch (err) {
        console.log("Project->getAllProjectsDB: " + err);
        return null;
    }
}

/**
 * Get a project
 * @param { Request } req { params: { projectID } }
 * @param { Response } res
 * @returns { [{ _id, name, status, videoId, script, creator, assignedAudioDescriptiors }] }
 */
exports.getProject = async function (req, res) {
    try {
        let project = await Project.findById(req.params.projectId);

        if (project)
            return res.status(200).send(project);
        return res.status(404).send(Errors.PROJECT_NOT_FOUND);
    } catch (err) {
        console.log("Project->getProject: " + err);
        return res.status(500).send(Errors.INTERNAL_ERROR);
    }
};

/**
 * Create a project
 * @param { Request } req { user: { userId }, body: { name, thumbnailId, description, videoId, script }}
 * @param { Response } res
 * @returns { status: Number, message: String }
 */
exports.createProject = async function (req, res) {
    try {
        if (!req.body.name || !req.body.description)
            return res.status(400).send(Errors.BAD_REQUEST_MISSING_INFOS);

        const newProject = new Project({
            name: req.body.name,
            status: 'Stop',
            thumbnailId: req.body.thumbnailId,
            videoId: req.body.videoId,
            description: req.body.description,
            script: req.body.script
        });
        await newProject.save();
        await Collaboration.createCollaborationDB(req.user.userId, newProject._id, "Owner", Role.OWNER);
        res.status(200).send(newProject);
    } catch (err) {
        console.log("Project->createProject: " + err);
        return res.status(500).send(Errors.INTERNAL_ERROR);
    }
};

/**
 * Delete a project
 * @param { Request } req { body: { projectId } }
 * @param { Response } res
 * @returns { status: Number, message: String }
 */
exports.deleteProject = async function (req, res) {
    try {
        const projectsListedToDelete = await ProjectListed.find({ projectId: req.params.projectId });
        for (var projectListed of projectsListedToDelete)
            await ProjectListed.deleteOne({ _id: projectListed._id });

        const collaborationsToDelete = await Collaboration.getAllCollaborationsWithProjectId(req.params.projectId);
        for (var collaboration of collaborationsToDelete)
            await Collaboration.deleteCollaborationDB(collaboration._id);

        await Project.deleteOne({ _id: req.params.projectId }); // TODO: Try multiple
        await Project.deleteMany({ _id: { $in: req.body.projectIds } });
        return res.status(204).send("");
    } catch (err) {
        console.log("Project->deleteProject: " + err);
        return res.status(500).send(Errors.INTERNAL_ERROR);
    }
}

/**
 * Delete a project
 * @param { Request } req { params: { projectId }, body: { status?, actualStep?, progress?, thumbnailId?, videoId?, description?, script? } }
 * @param { Response } res
 * @returns { status: Number, data: Project }
 */
exports.updateProject = async function (req, res) {
    try {
        const project = await Project.findByIdAndUpdate(req.params.projectId, req.body, { returnDocument: 'after' });
        return res.status(200).send(project);
    } catch (err) {
        console.log("Project->updateProject: " + err);
        return res.status(500).send(Errors.INTERNAL_ERROR);
    }
}

exports.getAllProjects = async function (req, res) {
    try {
        var projects = await module.exports.getAllProjectsDB(req.user.userId);
        if (!projects) {
            return res.status(500).send(Errors.INTERNAL_ERROR);
        }
        return res.status(200).send(projects);
    } catch (err) {
        console.log("Project->getAllProject: " + err);
        return res.status(500).send(Errors.INTERNAL_ERROR);
    }
}

/**
 * set the Status of a project from the ServerAPI
 * @param { Request } req { params: projectId, body: { statusType, stepType, percentage (no required) } }
 * @param { Response } res
 * @returns { response to send }
 */
exports.setStatus = async function (req, res) {
    try {
        if (!req.params.projectId || !req.body.statusType || !req.body.stepType)
            return (res.status(400).send(Errors.BAD_REQUEST_MISSING_INFOS));
        let project = await Project.findById(req.params.projectId);

        if (!project)
            return (res.status(400).send(Errors.PROJECT_NOT_FOUND));
        else if (!Object.values(enumStatus).includes(req.body.statusType) || !Object.values(enumActualStep).includes(req.body.stepType))
            return (res.status(400).send(Errors.BAD_REQUEST_BAD_INFOS));

        project.status = req.body.statusType;
        project.ActualStep = req.body.stepType;

        if (req.body.progress && req.body.progress >= 0 && progrreq.body.progressess <= 100)
            project.progress = req.body.progress;
        else if (req.body.statusType === 'Stop' || req.body.statusType === 'Error')
            project.progress = 0;
        else if (req.body.statusType === 'InProgress')
            project.progress = 50;
        else if (req.body.statusType === 'Done')
            project.progress = 100;

        await project.save();
        return (res.status(200).send("The status has been changed"));
    } catch (err) {
        console.log("Project->setStatus: " + err);
        return (res.status(400).send(Errors.BAD_REQUEST_BAD_INFOS));
    }
}

exports.generationIA = async function (req, res) {
    let returnCode = 200;
    let returnMessage = ""
    try {
        if (!req.body.typeGeneration) {
            throw Errors.BAD_REQUEST_BAD_INFOS;
        }
        let project = await Project.findById(req.params.projectId);
        if ((project.ActualStep === 'ActionRetrieve' || project.ActualStep === 'FaceRecognition') && project.status === 'InProgress') {
            returnMessage = 'Generation IA is in progress';
        } else {
            if (req.body.typeGeneration === 'ActionRetrieve') {
                await axios.post(`${process.env.SERVER_IA_URL}/AI/Action/NewProcess`);
            } else if (req.body.typeGeneration === 'FaceRecognition') {
                await axios.post(`${process.env.SERVER_IA_URL}/AI/FaceRecognition/NewProcess`);
            }
        }
    } catch (err) {
        console.log("Project->setStatus: " + err);
        returnCode = 400;
        returnMessage = err;
    }
    return (res.status(returnCode).send(returnMessage));
}