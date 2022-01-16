module.exports = function(app) {
    const Test = require('../Controllers/Test/TestServer.js');
    const Middleware = require('../Controllers/User/authMiddleware')

    app.get('/test', Test.testServer);

    app.get('/testAuth', Middleware.authenticateUser, Test.testAuth)
  }