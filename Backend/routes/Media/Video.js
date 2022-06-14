module.exports = function(app) {
    const video = require('../../Controllers/Media/Video/Video')
    const authMiddleware = require('../../Controllers/User/authMiddleware');
    const collabMiddleware = require('../../Controllers/Collaboration/collabMiddleware');

    app.post('/videos',
        authMiddleware.authenticateUser,
        video.createVideo
    );

    app.get('/videos/:projectId/:id',
        authMiddleware.authenticateUser,
        collabMiddleware.isCollab,
        video.getVideo
    );

    // app.put('/videosUrl/:id',
    //     video.putVideoUrl
    // );

    // app.get('/snsEndpoint',
    //     video.snsEndpoint
    // );
    app.post('/snsEndpoint',
        video.snsEndpoint
    );
}
