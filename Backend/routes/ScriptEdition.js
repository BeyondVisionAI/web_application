module.exports = function(app) {
    const scriptEdition = require("../Controllers/ScriptEdition");

    app.get("/projects/:projectId/script",
        scriptEdition.getProjectScript);
}