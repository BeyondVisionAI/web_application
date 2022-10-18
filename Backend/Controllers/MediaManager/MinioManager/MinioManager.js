const Minio = require('minio');
const { Errors } = require("../../../Models/Errors.js");

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
 * @returns {Promise<String> | { err: Error}}
 */
const getUrlUploadObject = function (objectType, keyName) {
    try {
        let bucketName = bucketsName[objectType];
        const url = minioClient.presignedUrl('PUT', bucketName, keyName, 24 * 60 * 60, function(err, presignedUrl) {
                if (err)
                    throw(err);
            }
        );
        console.log("🚀 ~ file: MinioManager.js ~ line 51 ~ url ~ url", url)
        return (url);
    } catch (err) {
        console.log('Error catch', err);
        return ({ error: err });
    }
}

/**
 * Get presigned url of keyname to download
 * @param {String} objectType source-video, thumbnail, audio or finished-video
 * @param {String} keyName the media name
 * @returns {Promise<String> | { err: Error}}
 */
const getUrlDownloadObject = function (objectType, keyName) {
    try {
        let bucketName = bucketsName[objectType];
        const url = minioClient.presignedUrl('GET', bucketName, keyName, 24 * 60 * 60, function(err, presignedUrl) {
            if (err)
                throw err;
        });
        return (url);
    } catch (err) {
        console.log('Error catch', err);
        return ({ error: err });
    }
}


/**
 * Remove object
 * @param {String} objectType source-video, thumbnail, audio or finished-video
 * @param {String} keyName the media name
 * @returns {Promise<Void> | { err: Error}}
 */
exports.removeObject = function (objectType, keyName) {
    try {
        let bucketName = bucketsName[objectType];
        const returnValues = minioClient.removeObject(bucketName, isFinishedMedia(objectType, keyName))

        return (returnValues)
    } catch (err) {
        console.log('Error catch', err);
        return ({ error: err });
    }
};

async function getSignedUrl(operationType, objectType, objectName) {
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
        return (Errors.INTERNAL_ERROR);
    } else {
        return (returnValues);
    }
}

module.exports = {
    getSignedUrl,
    getUrlDownloadObject,
    getUrlUploadObject
};