exports.registerUser = async function (request, firstName, lastName, email, password) {
    const res = await request.post("/user/register").send({
        firstName: firstName,
        lastName: lastName,
        password: password,
        email: email
    });
    return res;
};

exports.loginUser = async function(request, email, password) {
    const res = await request.post("/user/login").send({
        email: email,
        password: password
    });
    return res;
};

exports.registerAndLoginUser = async function(request, firstName, lastName, email, password) {
    await exports.registerUser(request, firstName, lastName, email, password);
    const res = await exports.loginUser(request, email, password);
    return res;
}

exports.getInformationsOnUser = async function(request, cookies) {
    const res = await request.get("/user/me").set("Cookie", cookies);
    return res;
}