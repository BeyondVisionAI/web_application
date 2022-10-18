const { Errors } = require("../../Models/Errors.js");
const S3Manager = require("./S3Manager/S3Manager");
const MinioManager = require("./MinioManager/MinioManager");

async function getSignedUrlObject(operationType, objectType, objectName) {
    if (process.env.LOCAL_FILE_MANAGER == true)
        return (await S3Manager.getSignedUrl(operationType, objectType, objectName));
    else
        return (await MinioManager.getSignedUrl(operationType, objectType, objectName));
}

/**
 *
 * @param {String} objectType source-video, thumbnail, audio or finished-video
 * @body {String} keyName the media name
 * @returns
 */
async function getSignedUrl(req, res) {
    const { objectType, operationType } = req.params;
    const { objectName } = req.body;
    let returnCode = 200;
    let returnValues = await getSignedUrlObject(operationType, objectType, objectName)

    if (returnValues === Errors.INTERNAL_ERROR || returnValues === {} || returnValues === undefined)
        returnCode = 500;
    console.log(returnValues);
    return res.status(returnCode).send(returnValues);
}

/**
 *
 * @param {String} objectType source-video, thumbnail, audio or finished-video
 * @param {String} keyName the media name
 * @returns
 */
 function getUrlDownloadObject(objectType, keyName) {
    if (process.env.LOCAL_FILE_MANAGER == true) {
        return S3Manager.getUrlDownloadObject(objectType, keyName)
    } else {
        return MinioManager.getUrlDownloadObject(objectType, keyName);
    }
}

/**
 *
 * @param {String} objectType source-video, thumbnail, audio or finished-video
 * @param {String} keyName the media name
 * @returns
 */
function removeObject(objectType, keyName) {
    if (process.env.LOCAL_FILE_MANAGER == true) {
        const S3Manager = require("./S3Manager/S3Manager");
        return S3Manager.removeObject(objectType, keyName)
    } else {
        const MinioManager = require("./MinioManager/MinioManager");
        return MinioManager.removeObject(objectType, keyName);
    }
}

module.exports = {
    getSignedUrl,
    getSignedUrlObject,
    getUrlDownloadObject,
    removeObject
};