const { Errors } = require("../../../Models/Errors.js");
const { Image } = require('../../../Models/Media/Image');

exports.getImage = async function(req, res) {
    try {
        const image = await Image.findById(req.params.id);

        if (image)
            return res.status(200).send(image);
        return res.status(404).send(Errors.IMAGE_NOT_FOUND);
    } catch (error) {
        console.log(`Image -> GetImageDb: ${error}`);
        return res.status(500).send(Errors.INTERNAL_ERROR);
    }
};

exports.updateImage = async function(req, res) {
    try {
        const image = await Image.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after' });
        return res.status(200).send(image);
    } catch (err) {
        console.log("Image->updateImage: " + err);
        return res.status(500).send(Errors.INTERNAL_ERROR);
    }
};

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