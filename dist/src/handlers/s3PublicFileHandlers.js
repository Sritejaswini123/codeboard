import { uploadPublicFileService } from '../s3/userProfileS3Service';
import factory from '../factory';
// import { uploadPublicFileService } from '../services/s3UploadPublic.service';
export const uploadPublicFileHandler = factory.createHandlers(async (c) => {
    const formData = await c.req.formData();
    const file = formData.get('file');
    if (!file) {
        return c.json({ error: 'No file uploaded' }, 400);
    }
    try {
        const url = await uploadPublicFileService(file);
        return c.json({ url });
    }
    catch (error) {
        console.error('Upload Error:', error);
        return c.json({ error: 'Failed to upload file' }, 500);
    }
});
