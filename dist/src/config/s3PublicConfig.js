import { publicS3Config } from "./s3Config";
import { S3Client } from '@aws-sdk/client-s3';
export const publicS3 = new S3Client({
    region: publicS3Config.publicRegion,
    credentials: {
        accessKeyId: publicS3Config.accessPublicKeyId,
        secretAccessKey: publicS3Config.secretPublicAccessKey,
    },
});
