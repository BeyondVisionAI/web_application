const { Collaboration } = require("../../Models/Collaboration");
const { Project } = require("../../Models/Project");
const { Role } = require("../../Models/Roles");

exports.createProjectDB = async function (mongoose, projectName) {
    const thumbnailId = mongoose.Types.ObjectId();
    const project = new Project({
        name: projectName,
        status: "Done",
        thumbnailId: thumbnailId,
        description: `A Description for ${projectName}`,
        videoLink: `VideoLink for ${projectName}`
    }).save();
    return project;
}

exports.createCollaborationDB = async function (projectId, userId, rights) {
    const collab = await new Collaboration({
        projectId: projectId,
        userId: userId,
        rights: rights,
        titleOfCollaboration: `Owner of Project`
    }).save();
    return collab;
}

exports.createProjectAndLinkToUserDB = async function (mongoose, projectName, userId) {
    const project = await exports.createProjectDB(mongoose, projectName);
    await exports.createCollaborationDB(project._id, userId, Role.OWNER);
    return project;
}