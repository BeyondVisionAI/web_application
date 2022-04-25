module.exports = function(app) {
    const image = require("./Image");
    const video = require("./Video");

    image(app);
    video(app);
}