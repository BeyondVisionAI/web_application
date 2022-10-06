export function getSignedUrl(req, res) {
    if (process.env.LOCAL_FILE_MANAGER == true) {
        const S3Manager = require("./S3Manager/S3Manager");
        S3Manager.getSignedUrl(req, res)
    } else {
        const MinioManager = require("./MinioManager/MinioManager");
        MinioManager.getSignedUrl(req, res);
    }
}