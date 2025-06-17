import { generateSignedUploadUrl, generateDownloadSignedUrl, deleteFileFromS3 } from '../service/s3PrivateFileService';
import { FILE_KEY_REQUIRED, FAILED_TO_GENERATE_URL, GENERATE_FAILED, MISSING_FILE_KEY } from '../constants/appMessages';
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from '../constants/httpStatusCodes';
//Generating 
export const uploadHandler = async (c) => {
    try {
        const { filename, contentType, size } = await c.req.json();
        if (!filename || !contentType || typeof size !== 'number') {
            return c.json({ success: false, error: 'Invalid request. Required: filename, contentType, size (number)' }, BAD_REQUEST);
        }
        const data = await generateSignedUploadUrl({ filename, contentType, size });
        return c.json({ success: true, data });
    }
    catch (err) {
        return c.json({ success: false, error: err.message }, INTERNAL_SERVER_ERROR);
    }
};
//download the signed url
export const getSignedDownloadUrlHandler = async (c) => {
    const key = c.req.query('key');
    if (!key) {
        return c.json({ success: false, error: FILE_KEY_REQUIRED }, BAD_REQUEST);
    }
    try {
        const url = await generateDownloadSignedUrl(key);
        return c.json({
            success: true,
            data: { url },
        });
    }
    catch (err) {
        console.error(FAILED_TO_GENERATE_URL, err);
        return c.json({ success: false, error: GENERATE_FAILED }, INTERNAL_SERVER_ERROR);
    }
};
//Delete file from S3
export const deleteFileHandler = async (c) => {
    try {
        const { key } = await c.req.json();
        if (!key) {
            return c.json({ success: false, error: MISSING_FILE_KEY }, BAD_REQUEST);
        }
        const result = await deleteFileFromS3(key);
        return c.json(result);
    }
    catch (err) {
        return c.json({ success: false, error: err.message }, INTERNAL_SERVER_ERROR);
    }
};
