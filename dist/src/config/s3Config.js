import { S3Client } from '@aws-sdk/client-s3';
export const s3Config = {
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
    region: process.env.AWS_S3_BUCKET_REGION,
    bucket: process.env.AWS_S3_BUCKET,
    expires: 3600,
};
export const publicS3Config = {
    accessPublicKeyId: process.env.AWS_S3_PUBLIC_ACCESS_KEY_ID,
    secretPublicAccessKey: process.env.AWS_S3_PUBLIC_SECRET_ACCESS_KEY,
    publicRegion: process.env.AWS_S3_PUBLIC_BUCKET_REGION,
    publicBucket: process.env.AWS_S3_PUBLIC_BUCKET,
    expires: 3600,
};
export const s3Client = new S3Client({
    region: s3Config.region,
    credentials: {
        accessKeyId: s3Config.accessKeyId,
        secretAccessKey: s3Config.secretAccessKey,
    },
});
