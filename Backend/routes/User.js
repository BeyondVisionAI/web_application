module.exports = function(app) {
    const Auth = require('../Controllers/User/Auth')
    const User = require('../Controllers/User/User')
    const Middleware = require('../Controllers/User/authMiddleware')

    app.post('/user/register', Auth.register)

    app.post('/user/login', Auth.login)

    app.get('/user', Middleware.authenticateUser, User.getUser)
}