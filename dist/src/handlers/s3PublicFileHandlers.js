// import { uploadPublicFileService } from '../services/s3UploadPublic.service';
import { uploadPublicFileService } from '../service/s3PublicFileService';
export const uploadPublicFileHandler = async (c) => {
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
};
