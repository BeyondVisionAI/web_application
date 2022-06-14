import AWS from 'aws-sdk';
// import axios from 'axios';

AWS.config.setPromisesDependency();

const AWSAccess = {
    accessKeyId: process.env.REACT_APP_S3_ID,
    secretAccessKey: process.env.REACT_APP_S3_SECRET
};

export function UploadFileOnS3(file, bucketName, region = 'us-east-1'/* process.env.REACT_APP_S3_REGION */, keyName = null)
{
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
        // }).on('httpUploadProgress', function(progress) {
        //     let progressPercentage = Math.round(progress.loaded / progress.total * 100);

        //     console.log(`Publishing progress : ${progressPercentage}`)
        //     if (progressPercentage === 100)
        //         ReceiveMessage();
        }).promise();
    } catch (err) {
        console.log('Error catch', err);
        return ({ code: 500, err: err }).promise();
    }
}

// function ManageMessages(messages) {
//     messages.forEach(message => {
//         const messageJson = JSON.parse(message.Body)
//         const id = (messageJson.srcVideo.split('.'))[0];

//         axios.get(`${process.env.REACT_APP_API_URL}/projects/${id}`)
//         .then(project => {
//             axios.put(`${process.env.REACT_APP_API_URL}/videosUrl/${project.data.videoId}`, {
//                 url: messageJson.hlsUrl,
//                 status: 'Posted'
//             })
//             .catch(err => console.error(err));
//         })
//         .catch(err => console.error(err))
//     });
// }

// export async function ReceiveMessage() {
//     const sqs = new AWS.SQS({ ...AWSAccess, apiVersion: '2012-11-05', region: 'us-east-1' });
//     let params = {
//         QueueUrl: 'https://sqs.us-east-1.amazonaws.com/353771239351/BeyondVision-VOD',
//         AttributeNames: [
//             "SentTimestamp"
//          ],
//          MaxNumberOfMessages: 10,
//          MessageAttributeNames: [
//             "All"
//          ],
//          VisibilityTimeout: 20,
//          WaitTimeSeconds: 0
//     };

//     try {
//         return sqs.receiveMessage(params, (err, data) => {
//             if (err) {
//                 return ({ code: 500, err: "S3 Upload issue" + err });
//             }
//             ManageMessages(data.Messages);
//             return ({ code: 200 })
//         }).promise;
//     } catch (error) {
//         return ({ code: 500, err: error }).promise();

//     }
// }

export async function DownloadFileUrl(bucketName, keyName)
{
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