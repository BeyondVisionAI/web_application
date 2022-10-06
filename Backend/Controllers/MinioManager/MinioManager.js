const Minio = require('minio');
const { Errors } = require("../../Models/Errors.js");
const { Video } = require('../../Models/Media/Video');
const { Image } = require('../../Models/Media/Image');

const minioClient = new Minio.Client({
    endPoint: process.env.MINIO_URL,
    useSSL: true,
    accesKey: process.env.MINIO_ACCESS_KEY,
    secretKey: process.env.MINIO_SECRET_KEY
});

const bucketsName = {
    bucketVideoSource: 'bv-streaming-video-source',
    bucketThumbnail: 'bv-thumbnail-project',
    bucketAudio: 'bv-replicas',
    bucketFinishedProduct: 'bv-finished-products'
}

const getUrlUploadObject = async function (bucketName, keyName) {
    try {
        const url = await new PromisePromise((resolve, reject) => {
            minioClient.PresignedPutObject(bucketName, keyName, 24*60*60, (err, presignedUrl) => {
                    if (err)
                        reject(err);
                    resolve(presignedUrl);
                })
            }
        )
    } catch (err) {
        console.log('Error catch', err);
        return ({ code: 500, err: err }).promise();
    }
}

const getUrlDownloadObject = async function (bucketName, keyName) {
    try {
        const url = await new PromisePromise((resolve, reject) => {
                minioClient.PresignedGetObject(bucketName, keyName, 24*60*60, (err, presignedUrl) => {
                    if (err)
                        reject(err);
                    resolve(presignedUrl);
                })
            }
        )
    } catch (err) {
        console.log('Error catch', err);
        return ({ code: 500, err: err }).promise();
    }
}

exports.getSignedUrl = async function (req, res) {
    console.log("Download Url Object", req.params);
    let objectName = req.params.objectName;
    const objectType = req.params.objectType;
    const operationType = req.params.operationType;
    let objectBucket = '';
    let url = '';

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
            url = getUrlDownloadObject(objectBucket, objectName);
            break;
        case 'Upload':
            url = getUrlUploadObject(objectBucket, objectName);
            break;
    }

    if (url === "" || url === {} || url === undefined || url.code === 500) {
        return res.status(500).send(Errors.INTERNAL_ERROR);
    } else {
        return res.status(200).send(url);
    }
}