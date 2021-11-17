module.exports = function(app) {
    const test = require("./Test");
    const user = require("./User")

    test(app);
    user(app);
  }