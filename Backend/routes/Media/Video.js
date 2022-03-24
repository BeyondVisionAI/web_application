module.exports = function(app) {
    const video = require('../../Controllers/Media/Video/Video')
    const authMiddleware = require('../../Controllers/User/authMiddleware');

    app.post('/videos',
        authMiddleware.authenticateUser,
        video.createVideo
    );

    app.get('/videos/:id',
        authMiddleware.authenticateUser,
        video.getVideo
    );
}