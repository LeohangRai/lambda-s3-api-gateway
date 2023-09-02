const aws = require('aws-sdk');
const s3 = new aws.S3();

// this env variable will be set thrugh the serverless.yml file
const BUCKET_NAME = process.env.BUCKET_NAME;

const handler = async function (event) {
    console.log("event:", event);
    try {
        const { body } = event;
        const parsedBody = JSON.parse(body);
        const base64FileString = parsedBody?.file;
        /* removes the initial part of the Data URL, which typically specifies the data type (e.g., "image/png" or "image/jpeg") */
        const base64FileStringStripped = base64FileString.replace(/^data:image\/\w+;base64,/, '');
        const fileBuffer = Buffer.from(base64FileStringStripped, 'base64url');
        const result = await s3.upload({
            Bucket: BUCKET_NAME,
            Key: parsedBody.fileKey,
            Body: fileBuffer,
            ContentType: 'image/jpeg'
        }).promise();
        return {
            statusCode: 200,
            body: JSON.stringify({    
                message: 'File upload successful!',
                result
            })
        }
    } catch (error) {
        console.log("Something went wrong while uploading the file: ", error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Something went wrong while uploading the file!',
                error
            })
        }
    }
}

module.exports = {
    handler
}