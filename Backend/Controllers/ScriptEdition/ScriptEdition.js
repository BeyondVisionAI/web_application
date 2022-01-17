const { Project } = require("../../Models/Project");
const { Errors } = require("../../Models/Errors.js");

exports.getProjectScript = async function(req, res) {
    try {
        var project = await Project.findById(req.params.projectId);
        if (!project)
            return res.status(404).send(Errors.PROJECT_NOT_FOUND);
        res.status(200).send(project.script);
    } catch (err) {
        return res.status(500).send(Errors.INTERNAL_ERROR);
    }
}