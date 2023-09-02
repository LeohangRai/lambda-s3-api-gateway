const aws = require('aws-sdk');
const s3 = new aws.S3();
const BUCKET_NAME = process.env.BUCKET_NAME;

const handler = async function(event) {
    console.log("event:", event);
    try {
        const result = await s3.getObject({
            Bucket: BUCKET_NAME,
            Key: decodeURIComponent(event.pathParameters.fileKey)
        }).promise();
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'File  retrieved successfully!',
                result
            })
        }
    } catch (error) {
        console.log('Something went wrong while fetching the file: ', error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Something went wrong while fetching the file!'
            })
        }
    }
}