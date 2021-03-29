module.exports = function(app) {
  const Test = require('../API/Test/TestServer.js');

  app.route('/api/test')
    .get(Test.testServer);
}