module.exports = function(app) {
    const Auth = require('../Controllers/User/Auth');
    const User = require('../Controllers/User/User');
    const Middleware = require('../Controllers/User/authMiddleware');

    app.post('/user/register', Middleware.onlyForUnAuthenticatedUser, Auth.register);

    app.post('/user/login', Middleware.onlyForUnAuthenticatedUser, Auth.login);

    app.post('/user/logout', Middleware.authenticateUser, Auth.logout);

    app.post('/user/verifyEmail', Auth.verifyEmail);

    app.post('/user/askForPasswordChange', Middleware.onlyForUnAuthenticatedUser, Auth.askForPasswordChange);

    app.post('/user/changePassword', Auth.changePassword);

    app.get('/user/me', Middleware.authenticateUser, User.getUser);
    
    app.get('/user/:userId/id', Middleware.authenticateUser, User.getUserById);

    app.post('/user/email', Middleware.authenticateUser, User.getUserByEmail);
}