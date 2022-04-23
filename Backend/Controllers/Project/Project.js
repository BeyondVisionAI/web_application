const { Project, enumStatus, enumActualStep } = require("../../Models/Project");
const Replica = require("../../Models/ScriptEdition/Replica");
const Collaboration = require("../../Controllers/Collaboration/Collaboration");
const { Role } = require("../../Models/Roles");
const { Errors } = require("../../Models/Errors.js");
const { ProjectListed } = require("../../Models/list/ProjectListed");

exports.getProjectDB = async function (projectId) {
    try {
        var project = await Project.findById(projectId);
        console.log(projectId);
        console.log(project);
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
        res.status("200").send(newProject);
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
        let { statusType, stepType, progress } = req.body;

        if (!req.params.projectId || !statusType || !stepType)
            return (res.status(400).send(Errors.BAD_REQUEST_MISSING_INFOS));
        var project = await Project.findById(req.params.projectId);

        if (!project)
            return (res.status(400).send(Errors.PROJECT_NOT_FOUND));
        else if (!Object.values(enumStatus).includes(statusType) || !Object.values(enumActualStep).includes(stepType))
            return (res.status(400).send(Errors.BAD_REQUEST_BAD_INFOS));

        project.status = statusType;
        project.ActualStep = stepType;

        if (progress && progress >= 0 && progress <= 100)
            project.progress = progress;
        else if (statusType === 'Stop' || statusType === 'Error')
            project.progress = 0;
        else if (statusType === 'InProgress')
            project.progress = 50;
        else if (statusType === 'Done')
            project.progress = 100;

        await project.save();
        return (res.status(200).send("The status has been changed"));
    } catch (err) {
        console.log("Project->setStatus: " + err);
        return (res.status(400).send(Errors.BAD_REQUEST_BAD_INFOS));
    }
}

/**
 * set the Status of a project from the ServerAPI
 * @param { Request } req { params: projectId, body: { jsonString } }
 * @param { Response } res
 * @returns { response to send }
 */
exports.setScript = async function (req, res) {
    try {
        if (!req.params.projectId || !req.body.jsonToSend)
            return (res.status(400).send(Errors.BAD_REQUEST_MISSING_INFOS));
        for (let key in req.body.jsonToSend.script) {
            let { actionName, startTime, endTime } = req.body.jsonToSend.script[key];

            let replica = await new Replica();
            replica = { projectId: req.params.projectId, content: actionName, timestamp: startTime, duration: endTime - startTime, voiceId: 1, lastEditDate: new Date() };
            await replica.save();
        }

        return (res.status(200).send("Script save to the project."));
    } catch (err) {
        console.log("Project->setScript: " + err);
        return (res.status(400).send(Errors.BAD_REQUEST_BAD_INFOS));
    }
}
