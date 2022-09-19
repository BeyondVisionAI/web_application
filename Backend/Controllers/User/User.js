const { Errors } = require("../../Models/Errors");
const { User } = require("../../Models/User");

exports.getUser = function(req, res) {
    if (!req.user) return res.status(404).send(Errors.USER_NOT_FOUND)
    return res.status(200).send(req.user)
}

exports.setStatus = async function(req, res) {
    try {
        if (!req.user || !req.body.employee)
        return (res.status(400).send(Errors.BAD_REQUEST_MISSING_INFOS));
    const out = await User.findOneAndUpdate({ _id: req.user.userId}, {employee: req.body.employee})
    return res.status(200).send(out)
        
    } catch (error) {
        console.error(error)
        return res.status(500).send(Errors.INTERNAL_ERROR);
    }
}

exports.getUserById = async function(req, res) {
    if (req.params.userId) {
        let userResulte = await User.findById(req.params.userId).select({password:0, verificationUID:0, isEmailConfirmed:0});

        if (userResulte)
            return res.status(200).send(userResulte);
    }
    return res.status(404).send(Errors.USER_NOT_FOUND)
}