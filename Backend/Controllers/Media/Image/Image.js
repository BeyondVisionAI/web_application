const { Errors } = require("../../../Models/Errors.js");
const { Image } = require('../../../Models/Media/Image');

exports.getImage = async function(req, res) {
    console.log(req.body);
    console.log('Get image on s3');
}; // TODO: Fill Fonction

exports.createImage = async function(req, res) {
    const { name, desc, ETag } = req.body;

    try {
        if (!name || !desc || !ETag)
            return res.status(400).send(Errors.BAD_REQUEST_MISSING_INFOS);
        const newImage = new Image({
            name: name,
            desc: desc,
            ETag: ETag,
        });
        await newImage.save();
        return res.status(200).send(newImage);
    } catch (err) {
        console.log("Image->createImage: " + err);
        return res.status(500).send(Errors.INTERNAL_ERROR);
    }
};