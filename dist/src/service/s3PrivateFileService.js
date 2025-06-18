import { PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { s3Client, s3Config } from '../config/s3Config';
import { validateUploadData } from '../validations/fileValidations';
export async function generateSignedUploadUrl({ filename, contentType, size }) {
    validateUploadData({ filename, contentType, size });
    const key = `userprofiles/${Date.now()}-${filename}`;
    const command = new PutObjectCommand({
        Bucket: s3Config.bucket,
        Key: key,
        ContentType: contentType,
    });
    const url = await getSignedUrl(s3Client, command, {
        expiresIn: s3Config.expires,
    });
    return { url, key };
}
//download signed URL
export const generateDownloadSignedUrl = async (key) => {
    const command = new GetObjectCommand({
        Bucket: s3Config.bucket,
        Key: key,
    });
    const url = await getSignedUrl(s3Client, command, {
        expiresIn: s3Config.expires,
    });
    return url;
};
