
exports.testServer = function(req, res) {
    res.statusCode = 200;
    res.send("You successfully contacted the server");
}

exports.testAuth = function(req, res) {
    res.statusCode = 200;
    res.send("You are logged in");
}