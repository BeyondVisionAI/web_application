import AWS from 'aws-sdk';

AWS.config.setPromisesDependency();

export function UploadFile(file, bucketnName, region = 'us-east-1', keyName = null)
{
    try {
        let s3 = new AWS.S3({
            accessKeyId: 'AKIAVEXTIW63VUWJ2LT7',
            secretAccessKey: '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',
            region: region
        });
        const params = {
            Bucket: bucketnName,
            Key: keyName,
            Body: file
        };
        console.log("Sending");

        return s3.upload(params, function (err, data) {
            if (err) {
                return ({ code: 500, err: "S3 Upload issue" + err });
            }
            console.log(`File uploaded successfully. ${data.Location}`);
            return ({ code: 200 })
        }).promise();
    } catch (err) {
        console.log('Error catch', err);
        return ({ code: 500, err: err }).promise();
    }
}