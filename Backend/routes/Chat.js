module.exports = function(app) {
    const authMiddleware = require("../Controllers/User/authMiddleware");
    const Chat = require("../Controllers/Chat/Chat")

    app.get('/chat/:roomID',
        authMiddleware.authenticateUser,
        Chat.getMessageFromRoom);
};