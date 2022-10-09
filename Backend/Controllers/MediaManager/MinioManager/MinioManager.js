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
 * @returns
 */
const getUrlUploadObject = async function (objectType, keyName) {
    try {
        let bucketName = bucketsName[objectType];
        const url = await new Promise((resolve, reject) => {
            minioClient.presignedPutObject(bucketName, isFinishedMedia(objectType, keyName), 24*60*60, (err, presignedUrl) => {
                    if (err)
                        reject(err);
                    resolve(presignedUrl);
            });
        });
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
 * @returns
 */
const getUrlDownloadObject = async function (objectType, keyName) {
    try {
        let bucketName = bucketsName[objectType];
        const url = await new Promise((resolve, reject) => {
            minioClient.presignedGetObject(bucketName, isFinishedMedia(objectType, keyName), 24*60*60, (err, presignedUrl) => {
                if (err)
                    reject(err);
                resolve(presignedUrl);
            });
        });
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
 * @returns
 */
exports.removeObject = async function (objectType, keyName) {
    try {
        let bucketName = bucketsName[objectType];

        const returnValues = await new Promise((resolve, reject) => {
            minioClient.removeObject(bucketName, isFinishedMedia(objectType, keyName), (err) => {
                if (err)
                    reject(err);
                resolve("Object successfully removed");
            });
        });
        return (returnValues)
    } catch (err) {
        console.log('Error catch', err);
        return ({ code: 500, err: err }).promise();
    }
};

async function getSignedUrl(req, res) {
    const { objectType, operationType } = req.params;
    const { objectName } = req.body;
    let returnValues = '';
    console.log(`${operationType} : ${objectType} with the name : ${objectName}`);

    switch (operationType) {
        case 'Download':
            returnValues = getUrlDownloadObject(objectType, objectName);
            break;
        case 'Upload':
            returnValues = getUrlUploadObject(objectType, objectName);
            break;
    }

    console.log("🚀 ~ file: MinioManager.js ~ line 121 ~ getSignedUrl ~ returnValues", returnValues);
    if (returnValues === "" || returnValues === {} || returnValues === undefined || returnValues.code === 500) {
        return res.status(500).send(Errors.INTERNAL_ERROR);
    } else {
        return res.status(200).send(returnValues);
    }
}

module.exports = {
    getSignedUrl,
    getUrlDownloadObject,
    getUrlUploadObject
};