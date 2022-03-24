module.exports = function(app) {
    const image = require('../../Controllers/Media/Image/Image');
    const authMiddleware = require('../../Controllers/User/authMiddleware');

    app.post('/images',
        authMiddleware.authenticateUser,
        image.createImage
    );
    app.get('/images/:id',
        authMiddleware.authenticateUser,
        image.getImage
    );
}