module.exports = function (app) {
  const image = require("./Image");
  const test = require("./Test");
  const user = require("./User");
  const project = require("./Project");
  const collaboration = require("./Collaboration");
  const list = require("./List");
  const listMember = require("./ListMember");
  const scriptEdition = require("./ScriptEdition");
  const communicationAPI = require("./CommunicationAPI");

  test(app);
  user(app);
  project(app);
  image(app);
  collaboration(app);
  list(app);
  listMember(app);
  //  scriptEdition(app);
  communicationAPI(app);
}