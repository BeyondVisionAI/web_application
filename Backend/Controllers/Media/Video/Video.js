const { Errors } = require("../../../Models/Errors.js");
const { Video } = require('../../../Models/Media/Video');


exports.getVideo = async function(req, res) {
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

exports.createVideo = async function(req, res)
{
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

// exports.putVideoUrl = async function(req, res)
// {
//     try {
//         const video = await Video.findByIdAndUpdate(req.params.id, req.body, {returnDocument: 'after'});

//         return res.status(200).send(video);
//     } catch (err) {
//         console.log("Video->updateUrl: " + err);

//         return res.status(500).send(Errors.INTERNAL_ERROR);
//     }
// }

exports.snsEndpoint = async function(req, res)
{
    try {
        console.log('-- SNS Notification --');
        console.log(req.data);
        let video;

        if (req.body.status) {
            video = await Video.findByIdAndUpdate(req.params.id, {status: req.body.status}, {returnDocument: 'after'});
        } else {

            video = await Video.findByIdAndUpdate(req.params.id, {url: req.body.hlsUrl, status: req.body.workflowStatus}, {returnDocument: 'after'});
        }
        return res.status(200).send(video);
    } catch (err) {
        console.log("Update Video data from SNS notification: " + err);

        return res.status(500).send(Errors.INTERNAL_ERROR);
    }
}