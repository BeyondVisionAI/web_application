const { Errors } = require("../../../Models/Errors.js");
const { Video } = require('../../../Models/Media/Video');


exports.getVideo = async function(req, res) {
    console.log(req.body);
    console.log('Get Video on s3');
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