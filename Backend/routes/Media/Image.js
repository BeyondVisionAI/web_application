module.exports = function(app) {
    const image = require('../../Controllers/Media/Image/Image');
    const authMiddleware = require('../../Controllers/User/authMiddleware');

    app.post('/image',
        // authMiddleware.authenticateUser,
        image.createImage
    );
    app.get('/image/:id',
        authMiddleware.authenticateUser,
        image.getImage
    );
}