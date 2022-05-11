const role = {
    OWNER: 'OWNER',
    ADMIN: 'ADMIN',
    WRITE: 'WRITE',
    READ: 'READ'
};

exports.isValidRole = function (roleToTest) {
    switch (roleToTest) {
        case role.OWNER:
            return true;
        case role.ADMIN:
            return true;
        case role.WRITE:
            return true;
        case role.READ:
            return true;
        default:
            return false;
    }
    return false;
};

exports.Role = role;