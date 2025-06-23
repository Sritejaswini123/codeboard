import { generateSignedUploadUrl, generateDownloadSignedUrl } from '../service/s3PrivateFileService';
import { FILE_KEY_REQUIRED, GENERATE_FAILED, INVALID_UPLOAD_REQUEST, KEY_DOES_NOT_EXIST } from '../constants/appMessages';
import { BAD_REQUEST } from '../constants/httpStatusCodes';
import InternalServerErrorException from '../exceptions/internalServerErrorException';
import BadRequestException from '../exceptions/badRequestException';
//Generating 
export const uploadHandler = async (c) => {
    try {
        const { filename, contentType, size } = await c.req.json();
        if (!filename || !contentType || typeof size !== 'number') {
            return c.json({ success: false, INVALID_UPLOAD_REQUEST }, BAD_REQUEST);
            // throw new BadRequestException(INVALID_UPLOAD_REQUEST);
        }
        const data = await generateSignedUploadUrl({ filename, contentType, size });
        return c.json({ success: true, data });
    }
    catch (err) {
        // return c.json({ success: false, error: err.message }, INTERNAL_SERVER_ERROR);
        throw new InternalServerErrorException;
    }
};
// //download the signed url
// export const getSignedDownloadUrlHandler = async (c: Context) => {
//   const key = c.req.query('key');//checks whether key is provided to the request 
//   if (!key) {
//     throw new BadRequestException(FILE_KEY_REQUIRED);
//   }
//   try {
//     const url = await generateDownloadSignedUrl(key);
//     return c.json({ success: true, data: {url},
//     });
//    } catch (err: any) {
//     if (err.message === 'KeyDoesNotExist') {
//       return c.json({ success: false, error: "FILE KEY DOES NOT EXIST" });
//     }
//   }
//    console.error(FAILED_TO_GENERATE_URL);
//     return c.json({ success: false, error: GENERATE_FAILED }, INTERNAL_SERVER_ERROR);
//   }
export const getSignedDownloadUrlHandler = async (c) => {
    const key = c.req.query('key');
    if (!key) {
        throw new BadRequestException(FILE_KEY_REQUIRED);
    }
    try {
        const url = await generateDownloadSignedUrl(key);
        return c.json({ success: true, data: { url } });
    }
    catch (err) {
        // Handle "file key does not exist" (from HeadObjectCommand error)
        if (err?.$metadata.httpStatusCode === 404 || err?.Code === 'NotFound') {
            return c.json({ success: false, error: KEY_DOES_NOT_EXIST });
        }
        // console.error(GENERATE_FAILED, err);
        // return c.json({ success: false, error: GENERATE_FAILED }, INTERNAL_SERVER_ERROR);
        throw new InternalServerErrorException(GENERATE_FAILED);
    }
};
