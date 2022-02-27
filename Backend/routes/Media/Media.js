module.exports = function(app) {
    const image = require("./Image.js");
    const video = require("./Video.js");

    image(app);
    video(app);
}