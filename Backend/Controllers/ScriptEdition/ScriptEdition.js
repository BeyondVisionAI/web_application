const { Project } = require("../../Models/Project");
const { Errors } = require("../../Models/Errors.js");
const { Replica } = require("../../Models/Replica");

exports.getProjectScript = async function(req, res) {
    try {
        // will be deleted once the malware will be created
        var project = await Project.findById(req.params.projectId);
        if (!project)
            return res.status(404).send(Errors.PROJECT_NOT_FOUND);

        var script = await Replica.find({projectId: req.params.projectId});
        res.status(200).send(script);
    } catch (err) {
        return res.status(500).send(Errors.INTERNAL_ERROR);
    }
}

// exports.updateProjectScript = async function(req, res) {
//     try {
//         let project = await Project.findById(req.params.projectId);
//         let hasChanged = false;


//     } catch (err) {
//         console.log("ScriptEdition => updateProjectScript : " + err);
//         return res.status(500).send(Errors.INTERNAL_ERROR);
//     }
// }