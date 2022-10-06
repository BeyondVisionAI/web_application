module.exports = function(app) {
    const test = require("./Test");
    const user = require("./User");
    const project = require("./Project");
    const collaboration = require("./Collaboration");
    const list = require("./List");
    const listMember = require("./ListMember");
    const scriptEdition = require("./ScriptEdition");
    const payment = require("./Payment");
    const media = require('./Media/Media.js');
    const chat = require('./Chat')
    const mail = require('./Mail')
    const S3Manager = require('./S3Manager')
    const MinioManager = require('./MinioManager')

    chat(app);
    test(app);
    user(app);
    project(app);
    collaboration(app);
    list(app);
    listMember(app);
    payment(app)
    media(app);
    scriptEdition(app);
    mail(app);
    S3Manager(app);
    MinioManager(app);
}
