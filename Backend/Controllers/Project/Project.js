const mongoose = require("mongoose");
const { Project } = require("../../Models/Project");

exports.getProject = async function(req, res) {
    var id = req.params.projectId;

    try {
        var project = await Project.findById(id);
        if (project)
            return res.status(200).send(project);
        return res.status(404).send("Project Not Found");
    } catch (err) {
        console.log(err);
        return res.status(404).send(err);
    }
};

exports.createProject = async function(req, res) {
    if (!req.body.name || !req.body.description)
        return res.status(400).send("Bad Request");

    const newProject = new Project({
        name: req.body.name,
        lastEdit: new Date(),
        // status: ENCOURS,
        imageId: "zertyui2345678zertyu2345",
        description: req.body.description,
        // script: ???,
        videoLink: "http://my-link-vers-la-video"
    });

    await newProject.save((err) => {
        console.error("🚀 ~ file: Project.js ~ line 33 ~ await newProject.save ~ err", err)
        if (err) return res.status(500).send("Internal Error")
    });

    res.status("200").send(newProject);
};

exports.deleteProject = async function(req, res) {
    var id = req.params.projectId;

    try {
        var project = await Project.findById(id);
        if (project) {
            await Project.deleteOne({ _id: id });
            return res.status(204).send("");
        }
        return res.status(404).send("Project Not Found");
    } catch (err) {
        console.log(err);
        return res.status(404).send(err);
    }
}

exports.updateProject = async function(req, res) {
    var id = req.params.projectId;

    console.log(id);
    try {
        var project = await Project.findById(id);
        var hasChanged = false;
        if (project) {
            if (req.body.name && req.body.name != project.name) {
                project.name = req.body.name;
                hasChanged = true;
            }
            if (req.body.description && req.body.description != project.description) {
                project.description = req.body.description;
                hasChanged = true;
            }
        }
        if (hasChanged === true) {
            project.lastEdit = new Date();
            await project.save((err) => {
                console.error("🚀 ~ file: Project.js ~ line 76 ~ await project.save ~ err", err)
                if (err) return res.status(500).send("Internal Error")
            });
            return res.status(200).send(project);
        }
        return res.status(404).send("Project Not Found");
    } catch (err) {
        console.log(err);
        return res.status(404).send(err);
    }
}