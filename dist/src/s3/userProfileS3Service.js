import { PutObjectCommand } from '@aws-sdk/client-s3';
// import { s3 } from '../utils/s3Client';
import { publicS3, publicS3Config } from '../config/s3Config';
export const uploadPublicFileService = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const key = `projectprofiles/${Date.now()}-${file.name}`;
    const command = new PutObjectCommand({
        Bucket: publicS3Config.publicBucket,
        Key: key,
        Body: buffer,
        ContentType: file.type,
    });
    await publicS3.send(command);
    const url = `https://${publicS3Config.publicBucket}.publicS3.${publicS3Config.publicRegion}.amazonaws.com/${key}`;
    return url;
};
