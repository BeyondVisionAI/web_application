function getSignedUrl(req, res) {    
    if (process.env.LOCAL_FILE_MANAGER == true) {
        const S3Manager = require("./S3Manager/S3Manager");
        S3Manager.getSignedUrl(req, res)
    } else {
        const MinioManager = require("./MinioManager/MinioManager");
        MinioManager.getSignedUrl(req, res);
    }
}

/**
 *
 * @param {String} objectType source-video, thumbnail, audio or finished-video
 * @param {String} keyName the media name
 * @returns
 */
 function getUrlDownloadObject(objectType, keyName) {
    if (process.env.LOCAL_FILE_MANAGER == true) {
        const S3Manager = require("./S3Manager/S3Manager");
        return S3Manager.getUrlDownloadObject(objectType, keyName)
    } else {
        const MinioManager = require("./MinioManager/MinioManager");
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
    getUrlDownloadObject,
    removeObject
};