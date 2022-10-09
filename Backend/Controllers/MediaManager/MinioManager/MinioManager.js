const Minio = require('minio');
const { Errors } = require("../../../Models/Errors.js");
const { Video } = require('../../../Models/Media/Video');
const { Image } = require('../../../Models/Media/Image');

const minioClient = new Minio.Client({
    endPoint: process.env.MINIO_ENDPOINT,
    port: parseInt(process.env.MINIO_PORT),
    useSSL: false,
    accessKey: process.env.MINIO_ACCESS_KEY,
    secretKey: process.env.MINIO_SECRET_KEY
});

const bucketsName = {
    'source-video': 'bv-streaming-video-source',
    'thumbnail': 'bv-thumbnail-project',
    'audio': 'bv-replicas',
    'finished-video': 'bv-finished-products'
}

/**
 * Change the keyName if is a finished object
 * @param {String} objectType source-video, thumbnail, audio or finished-video
 * @param {String} keyName the media name
 * @returns String
 */
const isFinishedMedia = function(objectType, keyName) {
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
 * @returns {Promise<String> | { code: Number, err: Error}}
 */
const getUrlUploadObject = function (objectType, keyName) {
    try {
        let bucketName = bucketsName[objectType];
        const url = minioClient.presignedPutObject(bucketName, isFinishedMedia(objectType, keyName), 24*60*60)

        return (url);
    } catch (err) {
        console.log('Error catch', err);
        return ({ code: 500, err: err });
    }
}

/**
 * Get presigned url of keyname to download
 * @param {String} objectType source-video, thumbnail, audio or finished-video
 * @param {String} keyName the media name
 * @returns {Promise<String> | { code: Number, err: Error}}
 */
const getUrlDownloadObject = function (objectType, keyName) {
    try {
        const bucketName = bucketsName[objectType];
        const url = minioClient.presignedGetObject(bucketName, isFinishedMedia(objectType, keyName), 24*60*60);

        return (url);
    } catch (err) {
        console.log('Error catch', err);
        return ({ code: 500, err: err });
    }
}


/**
 * Remove object
 * @param {String} objectType source-video, thumbnail, audio or finished-video
 * @param {String} keyName the media name
 * @returns {Promise<Void> | { code: Number, err: Error}}
 */
exports.removeObject = function (objectType, keyName) {
    try {
        let bucketName = bucketsName[objectType];

        const returnValues = minioClient.removeObject(bucketName, isFinishedMedia(objectType, keyName))

        return (returnValues)
    } catch (err) {
        console.log('Error catch', err);
        return ({ code: 500, err: err });
    }
};

async function getSignedUrl(req, res) {
    const { objectType, operationType } = req.params;
    const { objectName } = req.body;
    let returnValues = '';
    console.log(`${operationType} : ${objectType} with the name : ${objectName}`);

    switch (operationType) {
        case 'Download':
            returnValues = await getUrlDownloadObject(objectType, objectName);
            break;
        case 'Upload':
            returnValues = await getUrlUploadObject(objectType, objectName);
            break;
    }

    if (returnValues === "" || returnValues === {} || returnValues === undefined || returnValues.code === 500) {
        return res.status(500).send(Errors.INTERNAL_ERROR);
    } else {
        return res.status(200).send({url: returnValues});
    }
}

module.exports = {
    getSignedUrl,
    getUrlDownloadObject,
    getUrlUploadObject
};