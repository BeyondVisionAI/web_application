module.exports = function(app) {
    const test = require("./Test");
    const user = require("./User");
    const project = require("./Project");
    const collaboration = require("./Collaboration");
    const list = require("./List");
    const listMember = require("./ListMember");

    test(app);
    user(app);
    project(app);
    collaboration(app);
    list(app);
    listMember(app);
  }