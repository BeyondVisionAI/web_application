module.exports = function(app) {
    const scriptEdition = require("../Controllers/ScriptEdition/ScriptEdition.js");

    app.get("/projects/:projectId/script",
        scriptEdition.getProjectScript);
}