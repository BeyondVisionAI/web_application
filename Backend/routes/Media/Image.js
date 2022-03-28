module.exports = function(app) {
    const image = require('../../Controllers/Media/Image/Image');
    const authMiddleware = require('../../Controllers/User/authMiddleware');
    const collabMiddleware = require('../../Controllers/User/collabMiddleware');

    app.post('/images',
        authMiddleware.authenticateUser,
        image.createImage
    );
    app.get('/images/:projectId/:id',
        authMiddleware.authenticateUser,
        collabMiddleware.isCollab,
        image.getImage
    );
}
