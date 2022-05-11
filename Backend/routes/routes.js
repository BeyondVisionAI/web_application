module.exports = function(app) {
    // const image = require("./Image");
    const test = require("./Test");
    const user = require("./User");
    const project = require("./Project");
    const collaboration = require("./Collaboration");
    const list = require("./List");
    const listMember = require("./ListMember");
    const scriptEdition = require("./ScriptEdition");
    const payment = require("./Payment")
    const media = require('./Media/Media.js');
    const chat = require('./Chat')
    const mail = require('./Mail')

    chat(app);
    test(app);
    user(app);
    project(app);
    // image(app);
    collaboration(app);
    list(app);
    listMember(app);
    payment(app)
    media(app);
    scriptEdition(app);
    mail(app);
}
