import { Context } from "hono";

import { FILE_UPLOADED } from "../constants/appMessages";
import { BAD_REQUEST, CREATED } from "../constants/httpStatusCodes";
import factory from "../factory";
import UserProfileS3Service from "../s3/userProfileS3Service";
import { sendResponse } from "../utils/sendResponse";

const userProfileS3Service = new UserProfileS3Service();
const BUCKET_NAME = process.env.AWS_S3_BUCKET!;

export const getUserProfileUploadUrlHandler = factory.createHandlers(async (c: Context) => {
  try {
    const { fileName, fileType } = await c.req.json();
    console.log("hello---->1");
  
    if (!fileName || !fileType) {
      return sendResponse(c, BAD_REQUEST, "fileName and fileType are required");
    }
    console.log("hello---->2");

    const result = await userProfileS3Service.generateUploadPresignedUrl(fileName, fileType);
    console.log("hello---->3");
    return sendResponse(c, CREATED, FILE_UPLOADED, {result}); 
  } catch (error) {
    console.error("User profile upload URL generation failed:", error);
    return sendResponse(c, 500, "Failed to generate upload URL");
  }
});

export const getUserProfileDownloadUrlHandler = factory.createHandlers(async (c: Context) => {
  try {
    const fileKey = c.req.query("key");

    if (!fileKey) {
      return sendResponse(c, BAD_REQUEST, "File key is required");
    }

    const result = await userProfileS3Service.generateDownloadPresignedUrl(fileKey);
    return sendResponse(c, 200, "Download URL generated successfully", { url: result });
  } catch (error) {
    console.error("User profile download URL generation failed:", error);
    return sendResponse(c, 500, "Failed to generate download URL");
  }
});
