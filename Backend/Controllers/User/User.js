const { Errors } = require("../../Models/Errors");
const { User } = require("../../Models/User");

exports.getUser = function(req, res) {
    if (!req.user) return res.status(404).send(Errors.USER_NOT_FOUND)
    return res.status(200).send(req.user)
}