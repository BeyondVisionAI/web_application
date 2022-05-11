module.exports = function(app) {
    const Mail = require("../Controllers/Mail/Mail")

    app.post('/contactForm', Mail.contactForm);
};