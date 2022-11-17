import AWS from 'aws-sdk';

AWS.config.setPromisesDependency();

const AWSAccess = {
    accessKeyId: process.env.REACT_APP_S3_ID,
    secretAccessKey: process.env.REACT_APP_S3_SECRET
};

export function UploadFileOnS3(file, bucketName, region = process.env.REACT_APP_S3_REGION, keyName = null)
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
        }).promise();
    } catch (err) {
        console.log('Error catch', err);
        return ({ code: 500, err: err }).promise();
    }
}

export async function DownloadFileUrl(bucketName, keyName)
{
    try {
        let s3 = new AWS.S3({ ...AWSAccess, region: process.env.REACT_APP_S3_REGION });

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
