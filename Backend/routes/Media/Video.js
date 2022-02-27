module.exports = function(app) {
    const video = require('../../Controllers/Media/Video/Video.js')
    const authMiddleware = require('../../Controllers/User/authMiddleware');

    app.post('/video',
        // authMiddleware.authenticateUser,
        video.createVideo
    );

    app.get('/video/:id',
        authMiddleware.authenticateUser,
        video.getVideo
    );
}