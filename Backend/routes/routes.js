module.exports = function(app) {
    const test = require("./Test");
    const user = require("./User")
    const projectRouts = require("./Project")

    test(app);
    user(app);
    projectRouts(app);
  }