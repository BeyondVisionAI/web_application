module.exports = function(app) {
    const Auth = require('../Controllers/User/Auth')
    const User = require('../Controllers/User/User')
    const Middleware = require('../Controllers/User/authMiddleware')

    app.post('/user/register', Auth.register)
    
    app.post('/user/login', Auth.login)
    
    app.post('/user/logout', Middleware.authenticateUser, Auth.logout)

    app.post('/user/verifyEmail', Auth.verifyEmail)

    app.post('/user/askForPasswordChange', Auth.askForPasswordChange)
    
    app.post('/user/changePassword', Auth.changePassword)

    app.get('/user/me', Middleware.authenticateUser, User.getUser)
}