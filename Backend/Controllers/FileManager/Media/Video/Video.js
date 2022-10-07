const { Errors } = require("../../../Models/Errors.js");
const { Video } = require('../../../Models/Media/Video');
const { Project } = require("../../../Models/Project.js");


exports.getVideo = async function (req, res) {
    try {
        let video = await Video.findById(req.params.id);

        if (video)
            return res.status(200).send(video);
        return res.status(404).send(Errors.VIDEO_NOT_FOUND);
    } catch (err) {
        console.log("Project->getProject: " + err);
        return res.status(500).send(Errors.INTERNAL_ERROR);
    }
};

exports.createVideo = async function (req, res) {
    const { name, desc, ETag, url } = req.body;

    try {
        if (!name || !desc || !ETag)
            return res.status(400).send(Errors.BAD_REQUEST_MISSING_INFOS);
        const newVideo = new Video({
            name: name,
            desc: desc,
            ETag: ETag,
            url: url
        });
        await newVideo.save();
        return res.status("200").send(newVideo);
    } catch (err) {
        console.log("Video->createVideo: " + err);
        return res.status(500).send(Errors.INTERNAL_ERROR);
    }
}

exports.snsEndpoint = async function(req, res)
{
    try {
        let chunks = [];
        req.on('data', function (chunk) {
            chunks.push(chunk);
        });
        req.on('end', async function () {
            let message = JSON.parse(chunks.join(''));
            let body = JSON.parse(message.Message);
            var video;

            if (body.srcVideo) {
                let projectR = await Project.findById(body.srcVideo.split('.')[0]);

                if (body.status) {
                    video = await Video.findByIdAndUpdate(projectR.videoId, {status: body.status}, {returnDocument: 'after'});
                } else if (body.hlsUrl) {
                    video = await Video.findByIdAndUpdate(projectR.videoId, {url: body.hlsUrl, status: body.workflowStatus}, {returnDocument: 'after'});
                }
            }
            res.end();
        });
    } catch (err) {
        console.log("Update Video data from SNS notification: " + err);

        return res.status(500).send(Errors.INTERNAL_ERROR);
    }
}