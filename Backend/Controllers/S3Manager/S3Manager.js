var AWS = require('aws-sdk');
const { Errors } = require("../../Models/Errors.js");

AWS.config.setPromisesDependency();

const AWSAccess = {
    accessKeyId: 'AKIAVEXTIW63VUWJ2LT7',
    secretAccessKey: '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',
    region: 'us-east-1'
};


getObject = async function (bucketName, keyName) {
    try {
        console.log(`S3 : GetObject - Bucket Name : ${bucketName} - Key Name : ${keyName}`)
        let s3 = new AWS.S3(AWSAccess);
        params = {
            Bucket: bucketName,
            Key: keyName,
        };
        const data = await new Promise((resolve, reject) => {
            s3.getObject(params, function (err, data) {
                if (err) {
                    reject(err)
                }
                resolve(data)
            })
        });
        return (data.Body);
    } catch (err) {
        console.log('Error catch', err, err.stack);
        return ("")
    }
}

exports.getFinishedProductVideo = async function (req, res) {
    const projectId = req.params.projectId;
    const data = await getObject("bv-finish-products", `Video/${projectId}.mp4`);
    if (data === "" || data === null || data === {} || data === undefined) {
        return res.status(500).send(Errors.INTERNAL_ERROR);
    } else {
        console.log(`data send : ${data.length}`)
        return res.status(200).send(data);
    }
}

exports.getFinishedProductAudio = async function (req, res) {
    const projectId = req.params.projectId;
    const data = getObject("bv-finish-products", `Audio/${projectId}.mp3`);
    if (data === "" || data === null || data === {} || data === undefined) {
        return res.status(500).send(Errors.INTERNAL_ERROR);
    } else {
        console.log(`data send : ${data.length}`)
        return res.status(200).send(data);
    }
}

//     < Downloader bucket = '' keyName = {``}
// fileType = 'Video/mp4'
// label = 'Download Video' donwload />

//     <Downloader bucket='bv-finished-products' keyName={`Audio/${props.match.params.id}.mp3`}
//         fileType='audio/mpeg'
//         label='Download Audio' donwload />