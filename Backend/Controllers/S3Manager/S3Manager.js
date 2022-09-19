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

// const uploadObject = async function (bucketName, keyName, file) {
//     try {
//         console.log(`S3 : uploadObject - Bucket Name : ${bucketName} - Key Name : ${keyName}`)
//         let s3 = new AWS.S3(AWSAccess);
//         const params = {
//             Bucket: bucketName,
//             Key: keyName,
//             Body: file
//         };

//         const data = await new Promise((resolve, reject) => {
//             s3.upload(params, function (err, data) {
//                 if (err) {
//                     reject(err);
//                 }
//                 resolve(data);
//             })
//         });
//         return (data);
//     } catch (err) {
//         console.log('Error catch', err);
//         return ({ code: 500, err: err }).promise();
//     }
// }

const getUrlObject = async function (bucketName, keyName) {
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

// const getObject = async function (bucketName, keyName) {
//     try {
//         console.log(`S3 : GetObject - Bucket Name : ${bucketName} - Key Name : ${keyName}`)
//         let s3 = new AWS.S3(AWSAccess);
//         params = {
//             Bucket: bucketName,
//             Key: keyName,
//         };
//         const data = await new Promise((resolve, reject) => {
//             s3.getObject(params, function (err, data) {
//                 if (err) {
//                     reject(err)
//                 }
//                 resolve(data)
//             })
//         });
//         return (data.Body);
//     } catch (err) {
//         console.log('Error catch', err, err.stack);
//         return ("")
//     }
// }

exports.getDownloadUrlFinishedProductVideo = async function (req, res) {
    console.log("Download Finished Product Video", req.params);
    const projectId = req.params.projectId;
    const url = await getUrlObject("bv-finish-products", `Video/${projectId}.mp4`);
    if (url === "" || url === null || url === {} || url === undefined) {
        return res.status(500).send(Errors.INTERNAL_ERROR);
    } else {
        return res.status(200).send(url);
    }
}

// exports.getFinishedProductVideo = async function (req, res) {
//     const projectId = req.params.projectId;
//     const data = await getObject("bv-finish-products", `Video/${projectId}.mp4`);
//     if (data === "" || data === null || data === {} || data === undefined) {
//         return res.status(500).send(Errors.INTERNAL_ERROR);
//     } else {
//         console.log(`data send : ${data.length}`)
//         return res.status(200).send(data);
//     }
// }

exports.getDownloadUrlFinishedProductAudio = async function (req, res) {
    console.log("Download Finished Product Audio", req.params);
    const projectId = req.params.projectId;
    const url = await getUrlObject("bv-finish-products", `Audio/${projectId}.mp3`);
    if (url === "" || url === null || url === {} || url === undefined) {
        return res.status(500).send(Errors.INTERNAL_ERROR);
    } else {
        return res.status(200).send(url);
    }
}

// exports.getFinishedProductAudio = async function (req, res) {
//     const projectId = req.params.projectId;
//     const data = await getObject("bv-finish-products", `Audio/${projectId}.mp3`);

//     if (data === "" || data === null || data === {} || data === undefined) {
//         return res.status(500).send(Errors.INTERNAL_ERROR);
//     } else {
//         console.log(`data send : ${data.length}`)
//         return res.status(200).send(data);
//     }
// }

exports.getDownloadUrlSourceProductVideo = async function (req, res) {
    console.log("Download Source Product Video", req.params);
    const videoName = req.params.name;
    const url = await getUrlObject("bv-streaming-video-source-ahnauucgvgsf", videoName);
    if (url === "" || url === null || url === {} || url === undefined) {
        return res.status(500).send(Errors.INTERNAL_ERROR);
    } else {
        return res.status(200).send(url);
    }
}

exports.getUploadUrlSourceProductVideo = async function (req, res) {
    console.log("Upload Video", req.params);
    const videoName = req.params.name;
    const url = await getUrlUploadObject("bv-streaming-video-source-ahnauucgvgsf", videoName);
    if (url === "" || url === null || url === {} || url === undefined) {
        return res.status(500).send(Errors.INTERNAL_ERROR);
    } else {
        return res.status(200).send(url);
    }
}

// exports.postSourceProductVideo = async function (req, res) {
//     console.log("Test Upload Video", req.body);
//     const projectId = req.params.projectId;
//     const videoData = req.body.videoData;
//     const videoDesc = req.body.desc;
//     const videoName = req.body.name;
//     const data = uploadObject("bv-streaming-video-source-ahnauucgvgsf", `${projectId}.${videoName.split(".").pop()}`, videoData);

//     if (data === "" || data === null || data === {} || data === undefined || data.code === 500 || data.err !== undefined) {
//         return res.status(500).send(Errors.INTERNAL_ERROR);
//     } else {
//         try {
//             const newVideo = new Video({
//                 name: data.Key,
//                 desc: videoDesc,
//                 ETag: data.ETag,
//                 url: 'Url Undefined'
//             });
//             await newVideo.save();
//             return res.status(200).send("Video save!");
//         } catch (err) {
//             console.log("Video->createVideo: " + err);
//             return res.status(500).send(Errors.INTERNAL_ERROR);
//         }
//     }
// }

exports.getDownloadUrlSourceProductThumbnail = async function (req, res) {
    console.log("Download Image", req.params);
    const thumbnailName = req.params.name;
    const url = await getUrlObject("bv-thumbnail-project", thumbnailName);
    if (url === "" || url === null || url === {} || url === undefined) {
        return res.status(500).send(Errors.INTERNAL_ERROR);
    } else {
        return res.status(200).send(url);
    }
}

exports.getUploadUrlSourceProductThumbnail = async function (req, res) {
    console.log("Upload Image", req.params);
    const thumbnailName = req.params.name;
    const url = await getUrlUploadObject("bv-thumbnail-project", thumbnailName);
    if (url === "" || url === null || url === {} || url === undefined) {
        return res.status(500).send(Errors.INTERNAL_ERROR);
    } else {
        return res.status(200).send(url);
    }
}

// exports.postSourceProductThumbnail = async function (req, res) {
//     console.log("Test Upload Image", req.body);
//     const projectId = req.params.projectId;
//     const thumbnailData = req.body.thumbnailData;
//     const thumbnailDesc = req.body.desc;
//     const thumbnailName = req.body.name;
//     const data = uploadObject("bv-thumbnail-project", `${projectId}.${thumbnailName.split(".").pop()}`, thumbnailData);

//     if (data === "" || data === null || data === {} || data === undefined || data.code === 500 || data.err !== undefined) {
//         return res.status(500).send(Errors.INTERNAL_ERROR);
//     } else {
//         try {
//             const newImage = new Image({
//                 name: data.Key,
//                 desc: thumbnailDesc + " locate in bv-thumbnail-project bucket",
//                 ETag: data.ETag,
//             });
//             await newImage.save();
//             return res.status(200).send("Image save!");
//         } catch (err) {
//             console.log("Video->createVideo: " + err);
//             return res.status(500).send(Errors.INTERNAL_ERROR);
//         }
//     }
// }