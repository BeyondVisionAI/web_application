const { Errors } = require("../../Models/Errors");
const { User } = require("../../Models/User");

exports.getUser = function(req, res) {
    return res.status(200).send(req.user)
}