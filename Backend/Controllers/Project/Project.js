const { Project } = require("../../Models/Project");
const Collaboration = require("../../Controllers/Collaboration/Collaboration");
const { Role } = require("../../Models/Roles");
const { Errors } = require("../../Models/Errors.js");
const { ProjectListed } = require("../../Models/list/ProjectListed");

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
 * @param { Request } req { body: { projectID } }
 * @param { Response } res
 * @returns { [{ _id, name, status, videoLink, script, creator, assignedAudioDescriptiors }] }
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
 * @param { Request } req { user: { userId }, body: { name, thumbnailId, description, videoLink, script }}
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
            description: req.body.description,
            videoLink: req.body.videoLink,
            script: req.body.script,
        });
        await newProject.save();
        // await Collaboration.createCollaborationDB(req.user.userId, newProject._id, "Owner", Role.OWNER);
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
        // await Project.deleteMany({ _id: { $in: req.body.projectIds }});
        return res.status(204).send("");
    } catch (err) {
        console.log("Project->deleteProject: " + err);
        return res.status(500).send(Errors.INTERNAL_ERROR);
    }
}

exports.updateProject = async function (req, res) {
    try {
        // Question : Pour quoi pas utiliser Project.updateOne ?

        let project = await Project.findById(req.params.projectId);
        let hasChanged = false;

        if (req.body.name && req.body.name != project.name) {
            project.name = req.body.name;
            hasChanged = true;
        }
        if (req.body.description && req.body.description != project.description) {
            project.description = req.body.description;
            hasChanged = true;
        }
        if (hasChanged === true) {
            project.lastEdit = new Date();
            await project.save();
        }
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
