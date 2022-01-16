const { Collaboration } = require("../../Models/Collaboration");
const { Project } = require("../../Models/Project");
const { Role } = require("../../Models/Roles");
const { Errors } = require("../../Models/Errors");

/*
    Middleware created to check if the user is in collaboration with the project
    Useful for pratically all routes relatives to a project
*/
exports.isCollab = async function(req, res, next) {
    try {
        if (!req.user || !req.user.userId) {
            console.log("CollabMiddleware/isCollab --> No req.user or req.user.userId on the request");
            return res.status(401).send(Errors.USER_NOT_LOGIN);
        }

        var project = await Project.findById(req.params.projectId);
        if (!project) {
            console.log("CollabMiddleware/isCollab --> Project Not Found");
            return res.status(404).send(Errors.PROJECT_NOT_FOUND);
        }

        var collab = await Collaboration.findOne({ userId: req.user.userId, projectId: req.params.projectId });
        if (!collab) {
            console.log("CollabMiddleware/isCollab --> No collaboration found between the userId and the project");
            return res.status(401).send(Errors.PROJECT_NOT_YOURS);
        }
        next();
    } catch (err) {
        console.log("CollabMiddleware/isCollab --> Error catched: \n" + err);
        return res.status(500).send(Errors.INTERNAL_ERROR);
    }
}

/*
    Middleware created to check if the user is OWNER on the project
    Useful when user tried to delete project for example
*/
exports.hasRightOwner = async function(req, res, next) {
    try {
        if (!req.user || !req.user.userId) {
            console.log("CollabMiddleware/hasRightOwner --> No req.user or req.user.userId on the request");
            return res.status(401).send(Errors.USER_NOT_LOGIN);
        }

        var project = await Project.findById(req.params.projectId);
        if (!project) {
            console.log("CollabMiddleware/hasRightOwner --> Project Not Found");
            return res.status(404).send(Errors.PROJECT_NOT_FOUND);
        }

        var collab = await Collaboration.findOne({ userId: req.user.userId, projectId: req.params.projectId });
        if (!collab) {
            console.log("CollabMiddleware/hasRightOwner --> No collaboration found between the userId and the project");
            return res.status(401).send(Errors.PROJECT_NOT_YOURS);
        }

        if (collab.rights !== Role.OWNER) {
            console.log("CollabMiddleware/hasRightOwner --> OWNER rights required for this operation");
            return res.status(401).send(Errors.ROLE_UNAUTHORIZED);
        }
        next();
    } catch (err) {
        console.log("CollabMiddleware/hasRightOwner --> Error catched: \n" + err);
        return res.status(500).send(Errors.INTERNAL_ERROR);
    }
}

/*
    Middleware created to check if the user is OWNER or ADMIN on the project
    Useful when changing importants settings of the project (add new collaborations, change name, etc..)
*/
exports.hasRightAdmin = async function(req, res, next) {
    try {
        if (!req.user || !req.user.userId) {
            console.log("CollabMiddleware/hasRightAdmin --> No req.user or req.user.userId on the request");
            return res.status(401).send(Errors.USER_NOT_LOGIN);
        }

        var project = await Project.findById(req.params.projectId);
        if (!project) {
            console.log("CollabMiddleware/hasRightAdmin --> Project Not Found");
            return res.status(404).send(Errors.PROJECT_NOT_FOUND);
        }

        var collab = await Collaboration.findOne({ userId: req.user.userId, projectId: req.params.projectId });
        if (!collab) {
            console.log("CollabMiddleware/hasRightAdmin --> No collaboration found between the userId and the project");
            return res.status(401).send(Errors.PROJECT_NOT_YOURS);
        }

        if (collab.rights !== Role.ADMIN && collab.rights !== Role.OWNER) {
            console.log("CollabMiddleware/hasRightAdmin --> ADMIN or OWNER rights required for this operation");
            return res.status(401).send(Errors.ROLE_UNAUTHORIZED);
        }
        next();
    } catch (err) {
        console.log("CollabMiddleware/hasRightAdmin --> Error catched: \n" + err);
        return res.status(500).send(Errors.INTERNAL_ERROR);
    }
}

/*
    Middleware created to check if the user is OWNER, ADMIN, or WRITE on the project
    Useful when changing data in the project (Script, timelapse, etc...)
*/
exports.hasRightWrite = async function(req, res, next) {
    try {
        if (!req.user || !req.user.userId) {
            console.log("CollabMiddleware/hasRightWrite --> No req.user or req.user.userId on the request");
            return res.status(401).send(Errors.USER_NOT_LOGIN);
        }

        var project = await Project.findById(req.params.projectId);
        if (!project) {
            console.log("CollabMiddleware/hasRightWrite --> Project Not Found");
            return res.status(404).send(Errors.PROJECT_NOT_FOUND);
        }

        var collab = await Collaboration.findOne({ userId: req.user.userId, projectId: req.params.projectId });
        if (!collab) {
            console.log("CollabMiddleware/hasRightWrite --> No collaboration found between the userId and the project");
            return res.status(401).send(Errors.PROJECT_NOT_YOURS);
        }

        if (collab.rights !== Role.WRITE && collab.rights !== Role.ADMIN && collab.rights !== Role.OWNER) {
            console.log("CollabMiddleware/hasRightWrite --> WRITE, ADMIN, or OWNER rights required for this operation");
            return res.status(401).send(Errors.ROLE_UNAUTHORIZED);
        }
        next();
    } catch (err) {
        console.log("CollabMiddleware/hasRightWrite --> Error catched: \n" + err);
        return res.status(500).send(Errors.INTERNAL_ERROR);
    }
}