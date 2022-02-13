const { Project } = require("../../Models/Project");
const { Errors } = require("../../Models/Errors.js");
const getProjectDB = require("../Project/Project")

/**
 * set the Status of a project from the ServerAPI
 * @param { Request } req { body: { projectID, statusType, stepType, percentage (no required) } }
 * @param { Response } res
 * @returns { response to send }
 */
exports.setStatus = async function (req, res) {
    if (!req.body.projectID || !req.body.statusType || !req.body.stepType)
        return (res.status(400).send(Errors.BAD_REQUEST_MISSING_INFOS));

    const projectID = req.body.projectID
    const statusType = req.body.statusType
    const stepType = req.body.stepType
    const percentage = req.body.percentage
    var project = getProjectDB(projectID);
    if (project)
        return (res.status(400).send(Errors.PROJECT_NOT_FOUND));
    else if (!Object.values(Project.status.type).includes(statusType) || !Object.values(Project.ActualStep.type).includes(stepType))
        return (res.status(400).send(Errors.BAD_REQUEST_BAD_INFOS));

    project.status.type = statusType;
    project.ActualStep.type = stepType;

    if (percentage && percentage >= 0 && percentage <= 100)
        project.ActualStep.percentage = percentage;
    else if (statusType === 'Stop' || statusType === 'Error')
        project.ActualStep.percentage = 0;
    else if (statusType === 'InProgress')
        project.ActualStep.percentage = 50;
    else if (statusType === 'Done')
        project.ActualStep.percentage = 100;

    await project.save();
    return (res.status(200).send("The status has been changed"));
}