module.exports = function(app) {
    const image = require("./Image");
    const test = require("./Test");
    const user = require("./User");
    const project = require("./Project");
    const collaboration = require("./Collaboration");
    const scriptEdition = require("./ScriptEdition");

    test(app);
    user(app);
    project(app);
    image(app);
    collaboration(app);
    scriptEdition(app);
  }