import { PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { EXCEEDS_MAX_FILE_SIZE } from '../constants/appMessages';
import { s3Client, s3Config } from '../config/s3Config';
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export async function generateSignedUploadUrl({ filename, contentType, size, }) {
    if (size > MAX_FILE_SIZE) {
        throw new Error(EXCEEDS_MAX_FILE_SIZE);
    }
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
//DELETE FILE FROM S3
export async function deleteFileFromS3(key) {
    const command = new DeleteObjectCommand({
        Bucket: s3Config.bucket,
        Key: key,
    });
    await s3Client.send(command);
    return { success: true, message: ` Successfully Deleted: ${key}` };
}
