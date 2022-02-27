const multiparty = require('multiparty');
const { Errors } = require("../../../Models/Errors.js");
const { Video } = require('../../../Models/Media/Video');
const { uploadVideoOnS3 } = require('../s3Manager');

exports.getVideo = async function(req, res) {
    console.log(req.body);
    console.log('Get Video on s3');
};

async function createVideoInDb(name, desc, { ETag }, res) {
    // TODO: Get vidéo link
    try {
        if (!name || !desc || !ETag)
            return res.status(400).send(Errors.BAD_REQUEST_MISSING_INFOS);
        const newVideo = new Video({
            name: name,
            desc: desc,
            ETag: ETag,
            url: "Fake"
        });
        await newVideo.save();
        return res.status("200").send(newVideo);
    } catch (err) {
        console.log("Video->createVideo: " + err);
        return res.status(500).send(Errors.INTERNAL_ERROR);
    }
}

exports.createVideo = async function(req, res) {
    let form = new multiparty.Form();

    form.parse(req, async (err, fields) => {
        if (err) {
            console.log(err);
            throw err;
        }
        let data = await uploadVideoOnS3(fields.buffer, fields.name[0]);
        createVideoInDb(fields.name[0], fields.description[0], data, res);
    });
};