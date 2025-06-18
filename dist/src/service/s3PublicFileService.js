import { PutObjectCommand } from '@aws-sdk/client-s3';
import { publicS3Config, publicS3 } from '../config/s3Config';
import { validateUploadData } from '../validations/fileValidations';
export const uploadPublicFileService = async (file) => {
    // Prepare validation input
    const fileMetadata = {
        filename: file.name,
        contentType: file.type,
        size: file.size
    };
    // Perform validation
    await validateUploadData(fileMetadata);
    // Upload to S3
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
    const url = `http://${publicS3Config.publicBucket}.s3.${publicS3Config.publicRegion}.amazonaws.com/${key}`;
    return url;
};
