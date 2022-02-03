const multiparty = require('multiparty');
const { Errors } = require("../../Models/Errors.js");
const { Image } = require('../../Models/Image.js');
const AWS = require('aws-sdk');

exports.getImage = async function(req, res) {
    console.log(req.body);
    console.log('Get image on s3');
};

async function createImageInDb(name, desc, { ETag }, res) {
    try {
        if (!name || !desc || !ETag)
            return res.status(400).send(Errors.BAD_REQUEST_MISSING_INFOS);
        const newImage = new Image({
            name: name,
            desc: desc,
            ETag: ETag,
        });
        await newImage.save();
        return res.status("200").send(newImage);
    } catch (err) {
        console.log("Image->createImage: " + err);
        return res.status(500).send(Errors.INTERNAL_ERROR);
    }
}

async function uploadOnS3(part, key) {
// Get ID and SECRET
    let buf = Buffer.from(part[0].replace(/^data:image\/\w+;base64,/, ""),'base64')

    const s3 = new AWS.S3({
        accessKeyId: ID,
        secretAccessKey: SECRET
    });
    let params = {
        Bucket: 'bv-thumbnails-projects',
        Key: key,
        Body: buf,
        ContentEncoding: 'base64',
        ContentType: 'image/jpeg',
    };

    try {
        let data = await s3.upload(params).promise();

        console.log(`File uploaded successfully. ${data.Location}`);
        return data;
    } catch (error) {
        console.log(error)
    }
}

exports.createImage = async function(req, res) {
    let form = new multiparty.Form();

    form.parse(req, async (err, fields) => {
        if (err) {
            console.log(err);
            throw err;
        }
        let data = await uploadOnS3(fields.buffer, 'tes3t');
        createImageInDb(fields.name[0], fields.description[0], data, res);
    });
};