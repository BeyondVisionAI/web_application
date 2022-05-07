const AWS = require('aws-sdk');
const fs = require('fs');

const ID = "AKIAVEXTIW63VUWJ2LT7";
const SECRET = "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";

const s3 = new AWS.S3({
    accessKeyId: ID,
    secretAccessKey: SECRET
});

exports.uploadFile = function (fileName, bucketName, uploadName) {
    // Read content from the file
    const fileContent = fs.readFileSync(fileName);

    // Setting up S3 upload parameters
    const params = {
        Bucket: bucketName,
        Key: uploadName, // File name you want to save as in S3
        Body: fileContent
    };

    // Uploading files to the bucket
    s3.upload(params, function(err, data) {
        if (err) {
            throw err;
        }
        console.log(data);
    });
};
