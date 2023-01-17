const AWS = require('aws-sdk');
const { Errors } = require('../../Models/Errors');

AWS.config.setPromisesDependency();

const AWSAccess = {
    accessKeyId: process.env.S3_ID,
    secretAccessKey: process.env.S3_SECRET
};

exports.UploadFileOnS3 = async function (file, bucketName, region = process.env.S3_REGION, keyName = null) {
    try {
        let s3 = new AWS.S3({
            ...AWSAccess,
            region: region
        });
        const params = {
            Bucket: bucketName,
            Key: keyName,
            Body: file
        };

        return s3.upload(params, function (err, data) {
            if (err) {
                return ({ code: 500, err: "S3 Upload issue" + err });
            }
            console.log(`File uploaded successfully. ${data.Location}`);
            return ({ code: 200, res: data })
        }).promise();
    } catch (err) {
        console.log('Error catch', err);
        return ({ code: 500, err: err }).promise();
    }
}

exports.DownloadFileUrl = async function (bucketName, keyName) {
    try {
        let s3 = new AWS.S3({ ...AWSAccess, region: process.env.S3_REGION });
        const params = {
            Bucket: bucketName,
            Key: keyName,
        };
        console.log("🚀 ~ file: MediaManager.js:43 ~ params", params)
        const url = await s3.getSignedUrl('getObject', params);
        
        return (url);
    } catch (err) {
        console.log('Error catch', err, err.stack);
        return (null);
    }
}

exports.deleteFileS3 = async function (bucketName, keyName) {
    try {
        let s3 = new AWS.S3(AWSAccess);

        const params = {
            Bucket: bucketName,
            Key: keyName
        };

        s3.deleteObject(params, function (err, data) {
            if (err) {
                console.log('Error S3', Errors.ERROR_S3_DELETE);
                return ({ code: 84, err: Errors.ERROR_S3_DELETE });
            }
            console.log(`File deleted successfully. ${data.Location}`);
            return ({ Code: 0 })               // deleted
        });
    } catch (err) {
        console.log('Error catch', err);
        return ({ code: 84, err: err });
    }
}