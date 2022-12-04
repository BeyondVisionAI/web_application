const { Errors } = require("../../Models/Errors");
const { User } = require("../../Models/User");

exports.getUser = function(req, res) {
    if (!req.user) return res.status(404).send(Errors.USER_NOT_FOUND)
    return res.status(200).send(req.user)
}

exports.getUserById = async function(req, res) {
    if (req.params.userId) {
        let userResulte = await User.findById(req.params.userId).select({password:0, verificationUID:0, isEmailConfirmed:0});

        if (userResulte)
            return res.status(200).send(userResulte);
    }
    return res.status(404).send(Errors.USER_NOT_FOUND)
}

exports.getUserByEmail = async function(req, res) {
    if (!req.body.email) {
        console.log("User->getUserByEmail: Req.body not complete :\n" + req.body);
        return res.status(401).send(Errors.BAD_REQUEST_MISSING_INFOS);
    }

    const targetUser = await User.findOne({ email: req.body.email });
    if (!targetUser) {
        console.log("User->getUserByEmail: Target email isn't on the database");
        return res.status(404).send(Errors.EMAIL_UNKNOWN);
    }
    return res.status(200).send(targetUser);
    
}