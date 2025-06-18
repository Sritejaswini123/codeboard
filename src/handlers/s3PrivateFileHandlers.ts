import { Context } from 'hono';
import { generateSignedUploadUrl , generateDownloadSignedUrl} from '../service/s3PrivateFileService';
import { FILE_KEY_REQUIRED, FAILED_TO_GENERATE_URL, GENERATE_FAILED, MISSING_FILE_KEY, INVALID_UPLOAD_REQUEST } from '../constants/appMessages';
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from '../constants/httpStatusCodes';
import InternalServerErrorException from '../exceptions/internalServerErrorException';
import BadRequestException from '../exceptions/badRequestException';
//Generating 
export const uploadHandler = async (c: Context) => {
  try {
    const { filename, contentType, size } = await c.req.json();
    if (!filename || !contentType || typeof size !== 'number') {
      return c.json(
        { success: false, INVALID_UPLOAD_REQUEST },BAD_REQUEST );
      // throw new BadRequestException(INVALID_UPLOAD_REQUEST);
    }
    const data = await generateSignedUploadUrl({ filename, contentType, size });
    return c.json({ success: true, data });
  } catch (err: any) {
    // return c.json({ success: false, error: err.message }, INTERNAL_SERVER_ERROR);
    throw new InternalServerErrorException;
  }
};

//download the signed url
export const getSignedDownloadUrlHandler = async (c: Context) => {
  const key = c.req.query('key');
  if (!key) {
    throw new BadRequestException(FILE_KEY_REQUIRED);
  }
  try {
    const url = await generateDownloadSignedUrl(key);
    return c.json({ success: true, data: {url},
    });

   } catch (err: any) {
    if (err.message === 'KeyDoesNotExist') {
      return c.json({ success: false, error: "FILE KEY DOES NOT EXIST" });
    }

  }
   console.error(FAILED_TO_GENERATE_URL);
    return c.json({ success: false, error: GENERATE_FAILED }, INTERNAL_SERVER_ERROR);
  }




