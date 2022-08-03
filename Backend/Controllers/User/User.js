const { Errors } = require("../../Models/Errors");
const { User } = require("../../Models/User");

exports.getUser = function(req, res) {
    if (!req.user) return res.status(404).send(Errors.USER_NOT_FOUND)
    return res.status(200).send(req.user)
}

exports.setStatus = async function(req, res) {
    console.log("START")
    if (!req.user || !req.body.employee)
        return (res.status(400).send(Errors.BAD_REQUEST_MISSING_INFOS));

    console.log(req.user)
    const out = await User.findOneAndUpdate({ _id: req.user.userId}, {employee: req.body.employee})
    return res.status(200).send(out)
}