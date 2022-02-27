const AWS = require('aws-sdk');

export async function uploadImageOnS3(part, key) {
    let buf = Buffer.from(part[0].replace(/^data:image\/\w+;base64,/, ""), 'base64');

    console.log(process.env.S3_ID);
    const s3 = new AWS.S3({
        accessKeyId: process.env.S3_ID,
        secretAccessKey: process.env.S3_SECRET
    });
    let params = {
        Bucket: 'bv-thumbnails-projects',
        Key: key,
        Body: buf,
        ContentEncoding: 'base64'
    };

    try {
        let data = await s3.upload(params).promise();

        console.log(`File uploaded successfully. ${data.Location}`);
        return data;
    } catch (error) {
        console.error(error);
    }
}

export async function uploadVideoOnS3(part, key) {
    let buf = Buffer.from(part[0].replace(/^data:video\/\w+;base64,/, ""), 'base64');

    console.log(process.env.S3_ID);
    const s3 = new AWS.S3({
        accessKeyId: process.env.S3_ID,
        secretAccessKey: process.env.S3_SECRET
    });
    let params = {
        Bucket: 'bv-streaming-destination-1rdxo1j0aaek9',
        Key: key,
        Body: buf,
        ContentEncoding: 'base64'
    };

    try {
        let data = await s3.upload(params).promise();

        console.log(`File uploaded successfully. ${data.Location}`);
        return data;
    } catch (error) {
        console.log(error);
    }
}