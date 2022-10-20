const AWS = require('aws-sdk');

AWS.config.setPromisesDependency();

const AWSAccess = {
    // TODO IMPORTANT!!!!!! FAIRE DES VARIABLES D'ENV
    accessKeyId: 'AKIAVEXTIW63VUWJ2LT7',
    secretAccessKey: '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'
};

exports.UploadFileOnS3 = async function (file, bucketName, region = process.env.REACT_APP_S3_REGION, keyName = null) {
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
        let s3 = new AWS.S3({ ...AWSAccess, region: 'us-east-1' });
        const params = {
            Bucket: bucketName,
            Key: keyName,
        };
        const url = await new Promise((resolve, reject) => {
            s3.getSignedUrl('getObject', params, function (err, url) {
                if (err) {
                    reject(err);
                }
                resolve(url);
            })
        });
        return (url);
    } catch (err) {
        console.log('Error catch', err, err.stack);
        return ("");
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