import { Context } from "hono";

import factory from "../factory";
import { sendResponse } from "../utils/sendResponse";
import { CREATED, BAD_REQUEST } from "../constants/httpStatusCodes";
import { FILE_UPLOADED } from "../constants/appMessages";
import UserProfileS3Service from "../s3/userProfileS3Service";

const userProfileS3Service = new UserProfileS3Service();
const BUCKET_NAME = process.env.AWS_S3_BUCKET!;

export const getUserProfileUploadUrlHandler = factory.createHandlers(async (c: Context) => {
  try {
    const { fileName, fileType } = await c.req.json();
    console.log("hello---->1",fileName,fileType);
    console.log("hello----->x",BUCKET_NAME);
    
    
    if (!fileName || !fileType) {
      return c.json({ error: "fileName and fileType are required" }, BAD_REQUEST);
    }
    console.log("hello---->2",fileName,fileType);
    const result =userProfileS3Service.generateUploadPresignedUrl(fileName, fileType);
    console.log("hello---->3",fileName,fileType);
    return sendResponse(c, CREATED, FILE_UPLOADED, {result});
  } catch (error) {
    console.error("User profile upload URL generation failed:", error);
    return c.json({ error: "Failed to generate upload URL" }, 500);
  }
});

export const getUserProfileDownloadUrlHandler = factory.createHandlers(async (c: Context) => {
  try {
    const fileKey = c.req.query("key");

    if (!fileKey) {
      return c.json({ error: "File key is required" }, BAD_REQUEST);
    }

    const result = await userProfileS3Service.generateDownloadPresignedUrl(fileKey);
    return c.json(result);
  } catch (error) {
    console.error("User profile download URL generation failed:", error);
    return c.json({ error: "Failed to generate download URL" }, 500);
  }
});
