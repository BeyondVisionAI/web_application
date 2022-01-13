module.exports = function(app) {
    const List = require("../Controllers/List/List");
    const authMiddleware = require("../Controllers/User/authMiddleware");
    const listMiddleware = require("../Controllers/List/listMiddleware");

    app.get('/lists/mine',
        authMiddleware.authenticateUser,
        List.getListMyProjects);

    app.get('/lists/shared',
        authMiddleware.authenticateUser,
        List.getListSharedWithMe);

    app.get('/lists/:listId',
        authMiddleware.authenticateUser,
        listMiddleware.isMember,
        List.getCustomList);

    app.get('/lists',
        authMiddleware.authenticateUser,
        List.getAllCustomLists);

    app.post('/lists',
        authMiddleware.authenticateUser,
        List.createNewList);

    app.post('/lists/:listId/projects/:projectId',
        authMiddleware.authenticateUser,
        listMiddleware.hasRightAdmin,
        List.addProjectToList);

    app.delete('/lists/:listId/projects/:projectId',
        authMiddleware.authenticateUser,
        listMiddleware.hasRightAdmin,
        List.removeProjectFromList);

    app.delete('/lists/:listId',
        authMiddleware.authenticateUser,
        listMiddleware.hasRightOwner,
        List.deleteList);

    app.post('/lists/:listId/leave',
        authMiddleware.authenticateUser,
        listMiddleware.isMember,
        List.leaveList);
}