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


// //download signed URL
// export const generateDownloadSignedUrl = async (key: string): Promise<string> => {
//   await s3Client.send(
//     new HeadObjectCommand({// headobject checks the file is exsist or not 
//       Bucket: s3Config.bucket,
//       Key: key,
//     })
//   );
//   const command = new GetObjectCommand({
//     Bucket: s3Config.bucket,
//     Key: key,
//   });
//   const url = await getSignedUrl(s3Client, command, {
//     expiresIn: s3Config.expires,
//   });

//   return url;
// };


export const generateDownloadSignedUrl = async (key: string): Promise<string> => {
  //First, check if the key exists
  await s3Client.send(
    new HeadObjectCommand({
      Bucket: s3Config.bucket,
      Key: key,
    })
  );
  // If key exists, generate the download signed URL
  const command = new GetObjectCommand({
    Bucket: s3Config.bucket,
    Key: key,
  });
  const url = await getSignedUrl(s3Client, command, {
    expiresIn: s3Config.expires,
  });
  return url;
};
