module.exports = function(app) {
    const scriptEdition = require("../Controllers/ScriptEdition/ScriptEdition.js");
    const replica =  require("../Controllers/ScriptEdition/Replica.js")

    app.get("/projects/:projectId/script",
        scriptEdition.getProjectScript);

    app.post("/projects/:projectId/:replicaId",
        replica.createReplica);

    app.put("/projects/:projectId/:replicaId",
        replica.updateReplica);

    app.delete("/replica/:replicaId",
        replica.deleteReplica);
}