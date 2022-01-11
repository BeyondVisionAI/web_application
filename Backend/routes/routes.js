module.exports = function(app) {
    const test = require("./Test");
    const user = require("./User");
    const project = require("./Project");
    const collaboration = require("./Collaboration");

    test(app);
    user(app);
    project(app);
    collaboration(app);
  }