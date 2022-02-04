module.exports = function(app) {
    const ListMember = require("../Controllers/List/ListMember");
    const authMiddleware = require("../Controllers/User/authMiddleware");
    const listMiddleware = require("../Controllers/List/listMiddleware");

    app.get('/lists/:listId/members',
        authMiddleware.authenticateUser,
        listMiddleware.isMember,
        ListMember.getListMembers);

    app.post('/lists/:listId/members',
        authMiddleware.authenticateUser,
        listMiddleware.hasRightAdmin,
        ListMember.addNewListMember);

    app.patch('/lists/:listId/members/:memberId',
        authMiddleware.authenticateUser,
        listMiddleware.hasRightAdmin,
        ListMember.updateRoleOfMember);

    app.delete('/lists/:listId/members/:memberId',
        authMiddleware.authenticateUser,
        listMiddleware.hasRightAdmin,
        ListMember.removeMemberFromList);
};