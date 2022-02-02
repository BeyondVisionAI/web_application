const multiparty = require('multiparty');
const { Errors } = require("../../Models/Errors.js");

exports.getImage = async function(req, res) {
    console.log(req.body);
    console.log('Get image on s3');};

exports.createImage = async function(req, res) {
    console.log(req.body);
    console.log('Push image on s3');

    let form = new multiparty.Form();
    form.parse(req, (err, fields, files) => {
       Object.keys(fields).forEach((name) => {
            console.log('got field named ' + name);
        });
    });
};

// Todo: Post sur s3