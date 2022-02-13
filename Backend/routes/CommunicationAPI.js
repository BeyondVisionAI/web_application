module.exports = function (app) {
    const CommunicationAPI = require("../Controllers/CommunicationAPI/CommunicationAPI");

    app.post('/projects/setStatus',
        CommunicationAPI.setStatus);
}