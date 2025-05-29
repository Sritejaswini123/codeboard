export const s3Config = {
    access_key_id: process.env.AWS_S3_ACCESS_KEY_ID,
    secret_access_key: process.env.AWS_S3_SECRET_ACCESS_KEY,
    bucket_region: process.env.AWS_S3_BUCKET_REGION,
    bucket: process.env.AWS_S3_BUCKET,
    expires: 3600,
    public_access_key_id: process.env.PUBLIC_AWS_S3_ACCESS_KEY_ID,
    public_secret_access_key: process.env.PUBLIC_AWS_S3_SECRET_ACCESS_KEY,
    public_bucket: process.env.PUBLIC_AWS_S3_BUCKET,
};
