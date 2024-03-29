const { Collaboration } = require("../../Models/Collaboration");
const { Errors } = require("../../Models/Errors");
const { Role, isValidRole } = require("../../Models/Roles");
const { User } = require("../../Models/User");

exports.getCollaborationBetweenUserAndProjectDB = async function(userId, projectId) {
    var collab = await Collaboration.findOne({ userId: userId, projectId: projectId });
    return collab;
}

exports.createCollaborationDB = async function(userId, projectId, title, role) {
    try {
        var newCollab = new Collaboration({
            projectId: projectId,
            userId: userId,
            titleOfCollaboration: title,
            rights: role
        });
        await newCollab.save();
        var user = await User.findOne({_id: userId}, {firstName: 1, lastName: 1});
        var res = {...newCollab._doc, user: user._doc}
        return res;
    } catch (err) {
        console.log("Collaboration->createCollaborationDB: " + err);
        return null;
    }
}

exports.getAllCollaborationsDB = async function(userId) {
    const all = await Collaboration.find({ userId: userId });
    return all;
}

exports.getAllCollaborationsWithProjectId = async function(projectId) {
    const all = await Collaboration.find({ projectId: projectId });
    return all;
}

exports.deleteCollaborationDB = async function(collabId) {
    await Collaboration.deleteOne({ _id: collabId });
}

exports.getCollaborations = async function(req, res) {
    try {
        const filter = { projectId: req.params.projectId };
        const collaboration = await Collaboration.find(filter);
        const collaborators = []
        for (const e of collaboration) {
            const user = await User.findOne({_id: e.userId}, {firstName: 1, lastName: 1})
            collaborators.push({...e._doc, user: user})
        }
        return res.status(200).send(collaborators);
    } catch (err) {
        console.log("Collaboration->getCollaborations: " + err);
        return res.status(500).send(Errors.INTERNAL_ERROR);
    }
}

exports.createCollaboration = async function(req, res) {
    try {
        if (!req.body.email || !req.body.titleOfCollaboration || !req.body.rights || !isValidRole(req.body.rights)) {
            console.log("Collaboration->createCollaboration: Req.body not complete :\n" + req.body);
            return res.status(401).send(Errors.BAD_REQUEST_MISSING_INFOS);
        }
        if (req.body.rights === Role.OWNER) {
            console.log("Collaboration->createCollaboration: Can't give Role OWNER at creation");
            return res.status(400).send(Errors.CANT_GIVE_OWNER_AT_CREATION);
        }

        const targetUser = await User.findOne({ email: req.body.email });
        if (!targetUser) {
            console.log("Collaboration->createCollaboration: Target email isn't on the database");
            return res.status(404).send(Errors.EMAIL_UNKNOWN);
        }

        const oldCollab = await Collaboration.findOne({ userId: targetUser._id, projectId: req.params.projectId });
        if (oldCollab) {
            console.log("Collaboration->createCollaboration: This user " + targetUser._id + " is already linked to the project " + req.params.projectId);
            return res.status(401).send(Errors.COLLABORATION_ALREADY_EXISTS);
        }

        const newCollab = await module.exports.createCollaborationDB(targetUser._id, req.params.projectId, req.body.titleOfCollaboration, req.body.rights);
        return res.status(200).send(newCollab);
    } catch (err) {
        console.log("Collaboration->createCollaboration: " + err);
        return res.status(500).send(Errors.INTERNAL_ERROR);
    }
}

exports.updateCollaboration = async function(req, res) {
    try {
        var userCollab = await module.exports.getCollaborationBetweenUserAndProjectDB(req.user.userId, req.params.projectId);
        var targetCollab = await Collaboration.findById(req.params.collabId);

        //Safety checks
        if (!targetCollab) {
            console.log("Collaboration->updateCollaboration: Collaboration not found");
            return res.status(404).send(Errors.COLLABORATION_NOT_FOUND);
        }
        if (targetCollab.projectId != req.params.projectId) {
            console.log("Collaboration->updateCollaboration: Collaboration isn't linked to this project");
            return res.status(401).send(Errors.COLLABORATION_NOT_LINKED_TO_PROJECT);
        }
        if (String(targetCollab._id) === String(userCollab._id)) {
            console.log("Collaboration->updateCollaboration: User can't update his own Collaboration");
            return res.status(401).send(Errors.COLLABORATION_CANT_BE_CHANGED_YOURS);
        }
        if (targetCollab.rights === Role.OWNER) {
            console.log("Collaboration->updateCollaboration: An ADMIN can't change the OWNER's Collaboration");
            return res.status(401).send(Errors.ROLE_UNAUTHORIZED);
        }

        //Updates
        if (req.body.titleOfCollaboration && req.body.titleOfCollaboration !== targetCollab.titleOfCollaboration) {
            targetCollab.titleOfCollaboration = req.body.titleOfCollaboration;
        }
        if (req.body.rights && req.body.rights !== targetCollab.rights && isValidRole(req.body.rights)) {
            if (userCollab.rights === Role.ADMIN && req.body.rights === Role.OWNER) {
                console.log("Collaboration->updateRole: An ADMIN can't promote to OWNER");
                return res.status(401).send(Errors.ROLE_UNAUTHORIZED);
            }
            if (userCollab.rights === Role.OWNER && req.body.rights === Role.OWNER) {
                userCollab.rights = Role.ADMIN;
                await userCollab.save();
            }
            targetCollab.rights = req.body.rights;
        }
        await targetCollab.save();
        return res.status(200).send(targetCollab);
    } catch (err) {
        console.log("Collaboration->updateCollaboration: " + err);
        return res.status(500).send(Errors.INTERNAL_ERROR);
    }
}

exports.deleteCollaboration = async function(req, res) {
    try {
        const userCollab = await module.exports.getCollaborationBetweenUserAndProjectDB(req.user.userId, req.params.projectId);
        const targetCollab = await Collaboration.findById(req.params.collabId);

        if (!targetCollab) {
            console.log("Collaboration->deleteCollaboration: Collaboration not found");
            return res.status(404).send(Errors.COLLABORATION_NOT_FOUND);
        }
        if (targetCollab.projectId != req.params.projectId) {
            console.log("Collaboration->deleteCollaboration: Collaboration isn't linked to this project");
            return res.status(401).send(Errors.COLLABORATION_NOT_LINKED_TO_PROJECT);
        }
        if (String(targetCollab._id) === String(userCollab._id)) {
            console.log("Collaboration->deleteCollaboration: User can't delete his own Collaboration");
            return res.status(401).send(Errors.COLLABORATION_CANT_BE_CHANGED_YOURS);
        }
        if (targetCollab.rights === Role.OWNER) {
            console.log("Collaboration->deleteCollaboration: An ADMIN can't remove the OWNER from the project");
            return res.status(401).send(Errors.ROLE_UNAUTHORIZED);
        }

        await Collaboration.deleteOne({ _id: targetCollab._id });
        return res.status(204).send("");
    } catch (err) {
        console.debug("Collaboration->deleteCollaboration: " + err);
        return res.status(500).send(Errors.INTERNAL_ERROR);
    }
}

exports.leaveProject = async function(req, res) {
    try {
        //Check if the user is not the Owner, because Owner can't leave project, he delete it
        const collab = await module.exports.getCollaborationBetweenUserAndProjectDB(req.user.userId, req.params.projectId);
        if (collab.rights === Role.OWNER) {
            console.log("Collaboration->leaveProject: OWNER tried to leave project instead of deleted it");
            return res.status(401).send(Errors.ROLE_UNAUTHORIZED);
        }
        await Collaboration.deleteOne({ _id: collab._id });
        return res.status(200).send("");
    } catch (err) {
        console.log("Collaboration->leaveProject: " + err);
        return res.status(500).send(Errors.INTERNAL_ERROR);
    }
}