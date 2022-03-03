const { Errors } = require("../../Models/Errors");
const { ListMember } = require("../../Models/list/ListMember");
const { isValidRole, Role } = require("../../Models/Roles");
const { User } = require("../../Models/User");

exports.getListMembers = async function(req, res) {
    try {
        const all = await ListMember.find({ listId: req.params.listId });
        return res.status(200).send(all);
    } catch (err) {
        console.log("ListMember->getListMembers: " + err);
        return res.status(500).send(Errors.INTERNAL_ERROR);
    }
}

exports.addNewListMember = async function(req, res) {
    try {
        if (!req.body || !req.body.email || !req.body.rights || !isValidRole(req.body.rights)) {
            console.log("ListMember->addNewListMember: Missing element on the request");
            return res.status(401).send(Errors.BAD_REQUEST_MISSING_INFOS);
        }
        const userToAdd = await User.findOne({email: req.body.email});
        if (!userToAdd) {
            console.log("ListMember->addNewListMember: Email not known");
            return res.status(404).send(Errors.EMAIL_UNKNOWN);
        }
        if (req.body.rights === Role.OWNER) {
            console.log("ListMember->addNewListMember: Can't give Role OWNER at creation");
            return res.status(400).send(Errors.CANT_GIVE_OWNER_AT_CREATION);
        }
        const alreadyExist = await ListMember.findOne({ listId: req.params.listId, userId: userToAdd._id });
        if (alreadyExist) {
            console.log("ListMember->addNewListMember: User \"" + userToAdd._id + "\" already Member of the List \"" + req.params.listId + "\"");
            return res.status(400).send(Errors.LIST_MEMBER_ALREADY_EXISTS);
        }
        const newMemberList = new ListMember({
            listId: req.params.listId,
            userId: userToAdd._id,
            rights: req.body.rights
        })
        await newMemberList.save();
        return res.status(200).send(newMemberList);
    } catch (err) {
        console.log("ListMember->addNewListMember: " + err);
        return res.status(500).send(Errors.INTERNAL_ERROR);
    }
}

exports.updateRoleOfMember = async function(req, res) {
    try {
        var userMember = await ListMember.findOne({ userId: req.user.userId, listId: req.params.listId });
        var targetMember = await ListMember.findOne({ userId: req.params.memberId, listId: req.params.listId });

        //Safety checks
        if (!targetMember) {
            console.log("ListMember->updateRoleOfMember: ListMember not found");
            return res.status(404).send(Errors.LIST_MEMBER_NOT_FOUND);
        }
        if (String(targetMember._id) === String(userMember._id)) {
            console.log("ListMember->updateRoleOfMember: User can't update his own ListMember");
            return res.status(401).send(Errors.LIST_MEMBER_CANT_BE_CHANGED_YOURS);
        }
        if (targetMember.rights === Role.OWNER) {
            console.log("ListMember->updateRoleOfMember: An ADMIN can't change the OWNER's ListMember");
            return res.status(401).send(Errors.ROLE_UNAUTHORIZED);
        }
        if (!req.body.rights || !isValidRole(req.body.rights)) {
            console.log("ListMember->updateRoleOfMember: Bad request");
            return res.status(401).send(Errors.BAD_REQUEST_MISSING_INFOS);
        }
        if (userMember.rights === Role.ADMIN && req.body.rights === Role.OWNER) {
            console.log("ListMember->updateRole: An ADMIN can't promote to OWNER");
            return res.status(401).send(Errors.ROLE_UNAUTHORIZED);
        }
            
        targetMember = await updateRole(req, res, targetMember, userMember);
        await targetMember.save();
        return res.status(200).send(targetMember);
    } catch (err) {
        console.log("ListMember->updateRoleOfMember: " + err);
        return res.status(500).send(Errors.INTERNAL_ERROR);
    }
}

updateRole = async function(req, res, targetMember, userMember) {
    try {
        if (userMember.rights === Role.OWNER && req.body.rights === Role.OWNER) {
            userMember.rights = Role.ADMIN;
            await userMember.save();
        }
        targetMember.rights = req.body.rights;
        return targetMember;
    } catch (err) {
        console.log("ListMember->updateRole: " + err);
    }
}

exports.removeMemberFromList = async function(req, res) {
    try {
        var userMember = await ListMember.findOne({ listId: req.params.listId, userId: req.user.userId });
        var targetMember = await ListMember.findOne({ listId: req.params.listId, userId: req.params.memberId });

        if (!targetMember) {
            console.log("ListMember->removeMemberFromList: ListMember not found");
            return res.status(404).send(Errors.LIST_MEMBER_NOT_FOUND);
        }
        if (String(targetMember._id) === String(userMember._id)) {
            console.log("ListMember->removeMemberFromList: User can't delete his own MemberList");
            return res.status(401).send(Errors.LIST_MEMBER_CANT_BE_CHANGED_YOURS);
        }
        if (targetMember.rights === Role.OWNER) {
            console.log("ListMember->removeMemberFromList: An ADMIN can't change the OWNER's role");
            return res.status(401).send(Errors.ROLE_UNAUTHORIZED);
        }
        await ListMember.deleteOne({ _id: targetMember._id });
        return res.status(204).send("");
    } catch (err) {
        console.log("ListMember->removeMemberFromList: " + err);
        return res.status(500).send(Errors.INTERNAL_ERROR);
    }
}