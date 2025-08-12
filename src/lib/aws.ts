import { S3Client } from "@aws-sdk/client-s3"


const AWS_REGION = process.env.AWS_REGION;
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
if (!AWS_REGION || !AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY) {
    throw new Error("AWS credentials are not set in environment variables");
}

console.log("AWS_REGION:", AWS_REGION);
console.log("AWS_ACCESS_KEY_ID:", AWS_ACCESS_KEY_ID);
console.log("AWS_SECRET_ACCESS_KEY:", AWS_SECRET_ACCESS_KEY);

export const s3Client = new S3Client({
    region: AWS_REGION,
    credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
    },
})