const jwt = require("jsonwebtoken");
const { Errors } = require("../../Models/Errors");

exports.authenticateUser = function(req, res, next) {
    const userJWT = req.cookies.token;
    try {
        const user = jwt.verify(userJWT, process.env.JWT_SECRETKEY);
        req.user = user;
        next();
    } catch (err) {
        res.clearCookie("token");
        return res.status(401).send(Errors.USER_NOT_LOGIN);
    }
}