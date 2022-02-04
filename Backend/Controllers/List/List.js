const { Errors } = require("../../Models/Errors");
const Project = require("../../Controllers/Project/Project");
const Collaboration = require("../../Controllers/Collaboration/Collaboration");
const { Role } = require("../../Models/Roles");
const { List } = require("../../Models/list/List");
const { ListMember } = require("../../Models/list/ListMember");
const { ProjectListed } = require("../../Models/list/ProjectListed");

exports.getListMyProjects = async function(req, res) {
    try {
        const collabs = await Collaboration.getAllCollaborationsDB(req.user.userId);
        const projects = await Project.getAllProjectsDB(req.user.userId);
        var result = [];

        for (var collab of collabs) {
            if (collab.rights !== Role.OWNER)
                continue;
            var project = projects.find((elem) => String(elem._id) === String(collab.projectId));
            if (project)
                result.push(project);
            else
                console.log("List->getListMyProject: Collab \"" + collab._id + "\" is linked to a not existing projectId: " + collab.projectId);
        }
        return res.status(200).send(result);
    } catch (err) {
        console.log("List->getListMyProjects: " + err);
        return res.status(500).send(Errors.INTERNAL_ERROR);
    }
}

exports.getListSharedWithMe = async function(req, res) {
    try {
        const collabs = await Collaboration.getAllCollaborationsDB(req.user.userId);
        const projects = await Project.getAllProjectsDB(req.user.userId);
        var result = [];

        for (var collab of collabs) {
            if (collab.rights === Role.OWNER)
                continue;
            var project = projects.find((elem) => String(elem._id) === String(collab.projectId));
            if (project)
                result.push(project);
            else
                console.log("List->getListSharedWithMe: Collab \"" + collab._id + "\" is linked to a not existing projectId: " + collab.projectId);
        }
        return res.status(200).send(result);
    } catch (err) {
        console.log("List->getListSharedWithMe: " + err);
        return res.status(500).send(Errors.INTERNAL_ERROR);
    }
}

exports.getCustomList = async function(req, res) {
    try {
        const list = await List.findById(req.params.listId);
        if (!list) {
            console.log("List->getCustomList: List doesn't exist");
            return res.status(404).send(Errors.LIST_NOT_FOUND);
        }
        var result = {"_id": list._id, "name": list.name, "projects": []};
        const filter = {listId: req.params.listId};
        const projectOnList = await ProjectListed.find(filter);
        for (var project of projectOnList) {
            const temp = await Project.getProjectDB(project.projectId);
            if (temp)
                result.projects.push(temp);
            else
                console.log("List->getCustomList: ProjectListed \"" + project._id + "\" isn't linked to a Project existing");
        }
        return res.status(200).send(result);
    } catch (err) {
        console.log("List->getCustomList: " + err);
        return res.status(500).send(Errors.INTERNAL_ERROR);
    }
}

exports.getAllCustomLists = async function(req, res) {
    try {
        const myCustomListMembers = await ListMember.find({ userId: req.user.userId });
        var result = [];
        for (var myCustomListMember of myCustomListMembers) {
            const list = await List.findById(myCustomListMember.listId);
            if (!list) {
                console.log("List->getAllCustomLists: ListMember.listId \"" + myCustomListMember.listId + "\" doesn't exist in List Collection");
                continue;
            }
            var listResult = {"_id": list._id, "name": list.name, "projects": []};
            const filter = {listId: list._id};
            const projectOnList = await ProjectListed.find(filter);
            for (var project of projectOnList) {
                const temp = await Project.getProjectDB(project.projectId);
                if (temp)
                    listResult.projects.push(temp);
                else
                    console.log("List->getAllCustomLists: ProjectListed \"" + project.projectId + "\" isn't linked to a Project existing");
            }
            result.push(listResult);
        }
        return res.status(200).send(result);
    } catch (err) {
        console.log("List->getAllCustomLists: " + err);
        return res.status(500).send(Errors.INTERNAL_ERROR);
    }
}

exports.createNewList = async function(req, res) {
    try {
        if (!req.body || !req.body.name) {
            console.log("List->createNewList: Bad request, missing the name of the list");
            return res.status(400).send(Errors.BAD_REQUEST_MISSING_INFOS);
        }
        var newList = new List({ name: req.body.name });
        await newList.save();
        var newListMember = new ListMember({
            listId: newList._id,
            userId: req.user.userId,
            rights: Role.OWNER
        });
        await newListMember.save();
        return res.status(200).send(newList);
    } catch (err) {
        console.log("List->createNewList: " + err);
        return res.status(500).send(Errors.INTERNAL_ERROR);
    }
}

exports.addProjectToList = async function(req, res) {
    try {
        const project = await Project.getProjectDB(req.params.projectId);
        if (!project) {
            console.log("List->addProjectToList: Project \"" + req.params.projectId + "\" not found in Project Collection");
            return res.status(400).send(Errors.PROJECT_NOT_FOUND);
        }
        const list = await List.findById(req.params.listId);
        if (!list) {
            console.log("List->addProjectToList: List \"" + req.params.listId + "\" not found in List Collection");
            return res.status(400).send(Errors.PROJECT_NOT_FOUND);
        }
        const isExistingProjectInList = await ProjectListed.findOne({ projectId: req.params.projectId, listId: req.params.listId });
        console.log(isExistingProjectInList);
        if (isExistingProjectInList) {
            console.log("List->addProjectToList: Project \"" + req.params.projectId + "\" already in List \"" + req.params.listId);
            return res.status(401).send(Errors.PROJECT_LISTED_ALREADY_EXISTS);
        }

        var newProjectListed = new ProjectListed({
            projectId: project._id,
            listId: list._id
        });
        await newProjectListed.save();
        return res.status(200).send(newProjectListed);
    } catch (err) {
        console.log("List->addProjectToList: " + err);
        return res.status(500).send(Errors.INTERNAL_ERROR);
    }
}

exports.removeProjectFromList = async function(req, res) {
    try {
        const projectToDelete = await ProjectListed.findOne({ projectId: req.params.projectId, listId: req.params.listId });
        if (!projectToDelete) {
            console.log("List->removeProjectFromList: combinaison between ProjectId \"" + req.params.projectId + "\" and the ListId \"" + req.params.listId + "\" doesn't exist");
            return res.status(404).send(Errors.PROJECT_LISTED_NOT_FOUND);
        }
        await ProjectListed.deleteOne({ _id: projectToDelete._id });
        return res.status(200).send("");
    } catch (err) {
        console.log("List->removeProjectFromList: " + err);
        return res.status(500).send(Errors.INTERNAL_ERROR);
    }
}

exports.deleteList = async function(req, res) {
    try {
        const listId = req.params.listId;
        
        const membersToDelete = await ListMember.find({listId: listId});
        for (var memberToDelete of membersToDelete)
            await ListMember.deleteOne({ _id: memberToDelete._id });

        const projectsListedToDelete = await ProjectListed.find({ listId: listId });
        for (var projectListedToDelete of projectsListedToDelete)
            await ProjectListed.deleteOne({ _id: projectListedToDelete._id });

        await List.deleteOne({ _id: listId });
        return res.status(200).send("");
    } catch (err) {
        console.log("List->deleteList: " + err);
        return res.status(500).send(Errors.INTERNAL_ERROR);
    }
}

exports.leaveList = async function(req, res) {
    try {
        const member = await ListMember.find({ listId: req.params.listId, userId: req.user.userId });
        if (member.rights === Role.OWNER) {
            console.log("List->leaveList: User try to leave List \"" + req.params.listId + "\", but he is the OWNER of the list");
            res.status(401).send(Errors.ROLE_UNAUTHORIZED);
        }
        await ListMember.deleteOne({ _id: member._id });
        return res.status(200).send("");
    } catch (err) {
        console.log("List->leaveList: " + err);
        return res.status(500).send(Errors.INTERNAL_ERROR);
    }
}