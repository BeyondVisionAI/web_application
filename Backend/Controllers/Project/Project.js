const mongoose = require("mongoose");
const { Project } = require("../../Models/Project");
const Collaboration = require("../../Controllers/Collaboration/Collaboration");
const { Role } = require("../../Models/Roles");
const { Errors } = require("../../Models/Errors.js");

exports.getProject = async function(req, res) {
    try {
        var project = await Project.findById(req.params.projectId);
        if (project)
            return res.status(200).send(project);
        return res.status(404).send(Errors.PROJECT_NOT_FOUND);
    } catch (err) {
        console.log("Project->getProject: " + err);
        return res.status(500).send(Errors.INTERNAL_ERROR);
    }
};

exports.createProject = async function(req, res) {
    try {
        if (!req.body.name || !req.body.description)
            return res.status(400).send(Errors.BAD_REQUEST_MISSING_INFOS);

        const newProject = new Project({
            name: req.body.name,
            lastEdit: new Date(),
            // status: ENCOURS,
            imageId: "zertyui2345678zertyu2345",
            description: req.body.description,
            // script: ???,
            videoLink: "http://my-link-vers-la-video"
        });
        await newProject.save();
        await Collaboration.createCollaborationDB(req.user.userId, newProject._id, "Owner", Role.OWNER);
        res.status("200").send(newProject);
    } catch (err) {
        console.log("Project->createProject: " + err);
        return res.status(500).send(Errors.INTERNAL_ERROR);
    }
};

exports.deleteProject = async function(req, res) {
    try {
        await Project.deleteOne({ _id: req.params.projectId });
        return res.status(204).send("");
    } catch (err) {
        console.log("Project->deleteProject: " + err);
        return res.status(500).send(Errors.INTERNAL_ERROR);
    }
}

exports.updateProject = async function(req, res) {
    try {
        var project = await Project.findById(req.params.projectId);
        var hasChanged = false;
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

exports.getAllProjects = async function(req, res) {
    try {
        const collabs = await Collaboration.getAllCollaborationsDB(req.user.userId);
        var projects = [];
        for (const collab in collabs) {
            console.log(collabs[collab]);
            var project = await Project.findById(collabs[collab].projectId);
            if (project)
                projects.push(project);
            else
                console.log("Project->getAllProject: Collab \"" + collabs[collab]._id + "\" is linked to a not existing projectId: " + collab.projectId);
        }
        return res.status(200).send(projects);
    } catch (err) {
        console.log("Project->getAllProject: " + err);
        return res.status(500).send(Errors.INTERNAL_ERROR);
    }
}