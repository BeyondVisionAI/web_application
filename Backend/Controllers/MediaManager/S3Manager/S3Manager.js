var AWS = require('aws-sdk');
const mime = require('mime');
const { Errors } = require("../../Models/Errors.js");
const { Video } = require('../../Models/Media/Video');
const { Image } = require('../../Models/Media/Image');

AWS.config.setPromisesDependency();

const AWSAccess = {
    accessKeyId: process.env.S3_ID,
    secretAccessKey: process.env.S3_SECRET,
    region: 'us-east-1'
};

const bucketsName = {
    'source-video': 'bv-streaming-video-source-ahnauucgvgsf',
    'thumbnail': 'bv-thumbnail-project',
    'audio': 'bv-replicas',
    'finished-video': 'bv-finish-products'
}

/**
 * Change the keyName if is a finished object
 * @param {String} objectType source-video, thumbnail, audio or finished-video
 * @param {String} keyName the media name
 * @returns String
 */
 const isFinishedMedia = async function(objectType, keyName) {
    switch (objectType) {
        case 'finished-video':
            keyName = 'Video/' + keyName;
            break;
        case 'finished-audio':
            keyName = 'Audio/' + keyName;
            break;
        default:
            return keyName;
    }
}

/**
 * Get presigned url of keyname to upload
 * @param {String} objectType source-video, thumbnail, audio or finished-video
 * @param {String} keyName the media name
 * @returns
 */
const getUrlUploadObject = async function (objectType, keyName) {
    try {
        let bucketName = bucketsName[objectType];
        let s3 = new AWS.S3(AWSAccess);

        console.log(`S3 : uploadObject - Bucket Name : ${bucketName} - Key Name : ${isFinishedMedia(objectType, keyName)}`)
        const params = {
            ACL: "public-read",
            Bucket: bucketName,
            Key: isFinishedMedia(objectType, keyName),
            ContentType: mime.getType(keyName),
        };

        const data = await new Promise((resolve, reject) => {
            s3.getSignedUrl('putObject', params, function (err, url) {
                if (err)
                    reject(err);
                resolve(url);
            });
        });
        return (data);
    } catch (err) {
        console.log('Error catch', err);
        return ({ code: 500, err: err }).promise();
    }
}

/**
 * Get presigned url of keyname to download
 * @param {String} objectType source-video, thumbnail, audio or finished-video
 * @param {String} keyName the media name
 * @returns
 */
const getUrlDownloadObject = async function (objectType, keyName) {
    try {
        let bucketName = bucketsName[objectType];
        let s3 = new AWS.S3(AWSAccess);

        console.log(`S3 : GetObject - Bucket Name : ${bucketName} - Key Name : ${isFinishedMedia(objectType, keyName)}`)
        const params = {
            Bucket: bucketName,
            Key: isFinishedMedia(objectType, keyName)
        };
        const url = await new Promise((resolve, reject) => {
            s3.getSignedUrl('getObject', params, function (err, url) {
                if (err)
                    reject(err);
                resolve(url);
            });
        });
        return (url);
    } catch (err) {
        console.log('Error catch', err);
        return ("")
    }
}


/**
 *
 * @param {String} objectType source-video, thumbnail, audio or finished-video
 * @param {String} keyName the media name
 * @returns
 */
exports.removeObject = async function (objectType, keyName) {
    try {
        let s3 = new AWS.S3(AWSAccess);
        let bucketName = bucketsName[objectType];

        switch (objectType) {
            case 'finished-video':
                keyName = 'Video/' + keyName;
                break;
            case 'finished-audio':
                keyName = 'Audio/' + keyName;
                break;
        }

        const params = {
            Bucket: bucketName,
            Key: keyName
        };
        const returnValues = await new Promise((resolve, reject) => {
                s3.deleteObject(params, function (err, data) {
                    if (err)
                        reject(err);
                    resolve("Object successfully removed");
                })
            }
        )
        return (returnValues)
    } catch (err) {
        console.log('Error catch', err);
        return ({ code: 500, err: err }).promise();
    }
};

exports.getSignedUrl = async function (req, res) {
    const { objectType, operationType } = req.params;
    const { objectName } = req.body;
    let returnValues = '';

    console.log("Download Url Object", req.params);
    switch (operationType) {
        case 'Download':
            returnValues = getUrlDownloadObject(objectType, objectName);
            break;
        case 'Upload':
            returnValues = getUrlUploadObject(objectType, objectName);
            break;
    }

    if (returnValues === "" || returnValues === {} || returnValues === undefined || returnValues.code === 500) {
        return res.status(500).send(Errors.INTERNAL_ERROR);
    } else {
        return res.status(200).send(returnValues);
    }
}

module.exports = {
    getUrlDownloadObject,
    getUrlUploadObject
};