const { List } = require("../../Models/list/List");
const { ListMember } = require("../../Models/list/ListMember");
const { ProjectListed } = require("../../Models/list/ProjectListed");
const { Role } = require("../../Models/Roles");

exports.createListDB = async function (name) {
    const newList = new List({name: name}).save();
    return newList;
}

exports.createListMemberDB = async function (listId, userId, rights) {
    const newListMember = new ListMember({
        userId: userId,
        listId: listId,
        rights: rights
    }).save();
    return newListMember;
}

exports.createProjectListedDB = async function (listId, projectId) {
    const newProjectListed = new ProjectListed({
        projectId: projectId,
        listId: listId
    }).save();
    return newProjectListed;
}

exports.createListAndLinkToListMemberDB = async function (name, userId) {
    const list = await exports.createListDB(name);
    await exports.createListMemberDB(list._id, userId, Role.OWNER);
    return list;
}

exports.updateRoleOfMemberDB = async function (listId, targetId, newRole) {
    var member = await ListMember.find({listId: listId, userId: targetId});
    member.rights = newRole;
    await member.save();
    return member;
};