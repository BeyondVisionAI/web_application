module.exports = function(app) {
<<<<<<< HEAD
    const image = require("./Image");
    const test = require("./Test");
    const user = require("./User");
    const project = require("./Project");
    const collaboration = require("./Collaboration");
    const list = require("./List");
    const listMember = require("./ListMember");
    const scriptEdition = require("./ScriptEdition");
    const payment = require("./Payment")

    test(app);
    user(app);
    project(app);
    image(app);
    collaboration(app);
    list(app);
    listMember(app);
    payment(app)
//    scriptEdition(app);
  }
=======
  const media = require('./Media/Media.js');
  const test = require("./Test");
  const user = require("./User");
  const project = require("./Project");
  const collaboration = require("./Collaboration");
  const list = require("./List");
  const listMember = require("./ListMember");
  const scriptEdition = require("./ScriptEdition");

  test(app);
  user(app);
  project(app);
  media(app);
  collaboration(app);
  list(app);
  listMember(app);
  scriptEdition(app);
}
>>>>>>> origin/Dev
