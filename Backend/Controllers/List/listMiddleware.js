const { List } = require("../../Models/list/List");
const { ListMember } = require("../../Models/list/ListMember");
const { Role } = require("../../Models/Roles");
const { Errors } = require("../../Models/Errors");

/*
    Middleware created to check if the user is member of the list
    Useful for pratically all routes relatives to a list
*/
exports.isMember = async function(req, res, next) {
    try {
        if (!req.user || !req.user.userId) {
            console.log("ListMiddleware/isMember --> No req.user or req.user.userId on the request");
            return res.status(401).send(Errors.USER_NOT_LOGIN);
        }

        var list = await List.findById(req.params.listId);
        if (!list) {
            console.log("ListMiddleware/isMember --> List Not Found");
            return res.status(404).send(Errors.LIST_NOT_FOUND);
        }

        var member = await ListMember.findOne({ userId: req.user.userId, listId: req.params.listId });
        if (!member) {
            console.log("ListMiddleware/isMember --> No member found between the userId and the list");
            return res.status(401).send(Errors.LIST_NOT_YOURS);
        }
        next();
    } catch (err) {
        console.debug("ListMiddleware/isMember --> Error catched: \n" + err);
        return res.status(500).send(Errors.INTERNAL_ERROR);
    }
}

/*
    Middleware created to check if the user is member of the list
    Useful mainly for when user tried to delete list for example
*/
exports.hasRightOwner = async function(req, res, next) {
    try {
        if (!req.user || !req.user.userId) {
            console.log("ListMiddleware/hasRightOwner --> No req.user or req.user.userId on the request");
            return res.status(401).send(Errors.USER_NOT_LOGIN);
        }

        var list = await List.findById(req.params.listId);
        if (!list) {
            console.log("ListMiddleware/hasRightOwner --> List Not Found");
            return res.status(404).send(Errors.LIST_NOT_FOUND);
        }

        var member = await ListMember.findOne({ userId: req.user.userId, listId: req.params.listId });
        if (!member) {
            console.log("ListMiddleware/hasRightOwner --> No member found between the userId and the list");
            return res.status(401).send(Errors.LIST_NOT_YOURS);
        }

        if (member.rights !== Role.OWNER) {
            console.log("ListMiddleware/hasRightOwner --> OWNER rights required for this operation");
            return res.status(401).send(Errors.ROLE_UNAUTHORIZED);
        }
        next();
    } catch (err) {
        console.log("ListMiddleware/hasRightOwner --> Error catched: \n" + err);
        return res.status(500).send(Errors.INTERNAL_ERROR);
    }
}

/*
    Middleware created to check if the user is member of the list
    Useful when changing importants settings of the list(add members, change name, etc...)
*/
exports.hasRightAdmin = async function(req, res, next) {
    try {
        if (!req.user || !req.user.userId) {
            console.log("ListMiddleware/hasRightAdmin --> No req.user or req.user.userId on the request");
            return res.status(401).send(Errors.USER_NOT_LOGIN);
        }

        var list = await List.findById(req.params.listId);
        if (!list) {
            console.log("ListMiddleware/hasRightAdmin --> List Not Found");
            return res.status(404).send(Errors.LIST_NOT_FOUND);
        }

        var member = await ListMember.findOne({ userId: req.user.userId, listId: req.params.listId });
        if (!member) {
            console.log("ListMiddleware/hasRightAdmin --> No member found between the userId and the list");
            return res.status(401).send(Errors.LIST_NOT_YOURS);
        }

        if (member.rights !== Role.ADMIN && member.rights !== Role.OWNER) {
            console.log("ListMiddleware/hasRightAdmin --> ADMIN or OWNER rights required for this operation");
            return res.status(401).send(Errors.ROLE_UNAUTHORIZED);
        }
        next();
    } catch (err) {
        console.log("ListMiddleware/hasRightAdmin --> Error catched: \n" + err);
        return res.status(500).send(Errors.INTERNAL_ERROR);
    }
}

/*
    Middleware created to check if the user is member of the list
    Useful when changing data on the list(add projects, remove some, etc...)
*/
exports.hasRightWrite = async function(req, res, next) {
    try {
        if (!req.user || !req.user.userId) {
            console.log("ListMiddleware/hasRightWrite --> No req.user or req.user.userId on the request");
            return res.status(401).send(Errors.USER_NOT_LOGIN);
        }

        var list = await List.findById(req.params.listId);
        if (!list) {
            console.log("ListMiddleware/hasRightWrite --> List Not Found");
            return res.status(404).send(Errors.LIST_NOT_FOUND);
        }

        var member = await ListMember.findOne({ userId: req.user.userId, listId: req.params.listId });
        if (!member) {
            console.log("ListMiddleware/hasRightWrite --> No member found between the userId and the list");
            return res.status(401).send(Errors.LIST_NOT_YOURS);
        }

        if (member.rights !== Role.WRITE && member.rights !== Role.ADMIN && member.rights !== Role.OWNER) {
            console.log("ListMiddleware/hasRightWrite --> ADMIN or OWNER rights required for this operation");
            return res.status(401).send(Errors.ROLE_UNAUTHORIZED);
        }
        next();
    } catch (err) {
        console.log("ListMiddleware/hasRightWrite --> Error catched: \n" + err);
        return res.status(500).send(Errors.INTERNAL_ERROR);
    }
}