import AWS from 'aws-sdk';

AWS.config.setPromisesDependency();
AWS.config.update({
    region: process.env.S3_REGION,
    accessKeyId: process.env.S3_ID,
    secretAccessKey: process.env.S3_SECRET
});

export function UploadFile(file, bucketnName, keyName = null)
{
    try {
        let s3 = new AWS.S3();
        const params = {
            Bucket: bucketnName,
            Key: keyName,
            Body: file
        };
        console.log("Sending");

        return s3.upload(params, function (err, data) {
            if (err) {
                return ({ code: 500, err: "S3 Upload issue" });
            }
            console.log(`File uploaded successfully. ${data.Location}`);
            return ({ code: 200 })
        }).promise();
    } catch (err) {
        console.log('Error catch', err);
        return ({ code: 500, err: err }).promise();
    }
}