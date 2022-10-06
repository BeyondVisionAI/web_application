var AWS = require('aws-sdk');
const mime = require('mime');
const { Errors } = require("../../Models/Errors.js");
const { Video } = require('../../Models/Media/Video');
const { Image } = require('../../Models/Media/Image');

AWS.config.setPromisesDependency();

const AWSAccess = {
    accessKeyId: 'AKIAVEXTIW63VUWJ2LT7',
    secretAccessKey: '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',
    region: 'us-east-1'
};

const bucketsName = {
    bucketVideoSource: 'bv-streaming-video-source-ahnauucgvgsf',
    bucketThumbnail: 'bv-thumbnail-project',
    bucketAudio: 'bv-replicas',
    bucketFinishedProduct: 'bv-finish-products'
}

const getUrlUploadObject = async function (bucketName, keyName) {
    try {
        console.log(`S3 : uploadObject - Bucket Name : ${bucketName} - Key Name : ${keyName}`)
        let s3 = new AWS.S3(AWSAccess);
        const params = {
            ACL: "public-read",
            Bucket: bucketName,
            Key: keyName,
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

const getUrlDownloadObject = async function (bucketName, keyName) {
    try {
        console.log(`S3 : GetObject - Bucket Name : ${bucketName} - Key Name : ${keyName}`)
        let s3 = new AWS.S3(AWSAccess);
        params = {
            Bucket: bucketName,
            Key: keyName
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

const removeObject = async function (bucketName, keyName) {
    try {
        let s3 = new AWS.S3(AWSAccess);

        const params = {
            Bucket: bucketName,
            Key: keyName
        };

        const returnValues = await new PromisePromise((resolve, reject) => {
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
    console.log("Download Url Object", req.params);
    let objectName = req.params.objectName;
    const objectType = req.params.objectType;
    const operationType = req.params.operationType;
    let objectBucket = '';
    let returnValues = '';

    switch (objectType) {
        case 'source-video':
            objectBucket = bucketsName.bucketVideoSource;
            break;
        case 'thumbnail':
            objectBucket = bucketsName.bucketVideoSource;
            break;
        case 'audio':
            objectBucket = bucketsName.bucketAudio;
            break;
        case 'finished-video':
            objectName = 'Video/' + objectName;
            objectBucket = bucketsName.bucketFinishedProduct;
            break;
        case 'finished-audio':
            objectName = 'Audio/' + objectName;
            objectBucket = bucketsName.bucketFinishedProduct;
            break;
    }
    switch (operationType) {
        case 'Download':
            returnValues = getUrlDownloadObject(objectBucket, objectName);
            break;
        case 'Upload':
            returnValues = getUrlUploadObject(objectBucket, objectName);
            break;
        case 'Remove':
            returnValues = removeObject(objectBucket, objectName);
            break;
    }

    if (returnValues === "" || returnValues === {} || returnValues === undefined || returnValues.code === 500) {
        return res.status(500).send(Errors.INTERNAL_ERROR);
    } else {
        return res.status(200).send(returnValues);
    }
}