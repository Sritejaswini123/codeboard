import { PutObjectCommand, GetObjectCommand , DeleteObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import {s3Client, s3Config} from '../config/s3Config'
import { UploadRequestBody } from '../types/upload';
import { validateUploadData } from '../validations/fileValidations';
 
export async function generateSignedUploadUrl({ filename, contentType, size}: UploadRequestBody) {
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
  return {url,key};
}


//download signed URL
export const generateDownloadSignedUrl = async (key: string): Promise<string> => {
//checking the key exsists or not
    try {
    await s3Client.send(
      new HeadObjectCommand({//HeadObjectCommand checks if a file exists
        Bucket: s3Config.bucket,
        Key: key,
      })
    );
  } catch (err: any) {
    if (err.name === 'NotFound') {
      throw new Error('KeyDoesNotExist');
    }
    throw err;
  }
  const command = new GetObjectCommand({
    Bucket: s3Config.bucket,
    Key: key,
  });
  const url = await getSignedUrl(s3Client, command, {
    expiresIn: s3Config.expires,
  });
  return url;
};
