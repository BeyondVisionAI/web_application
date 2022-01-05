module.exports = function(app) {
    const test = require("./Test");
    const user = require("./User");
    const project = require("./Project");

    test(app);
    user(app);
    project(app);
  }