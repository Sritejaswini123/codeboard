import { PutObjectCommand, GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Context } from "hono";
import { OK, BAD_REQUEST, INTERNAL_SERVER_ERROR } from "../constants/httpStatusCodes";
import { sendResponse } from "../utils/sendResponse";
import { UploadSchema } from "../validations/uploadSchemaValidation";
import factory from "../factory";

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY!,
    secretAccessKey: process.env.AWS_SECRET_KEY!,
  },
});

const BUCKET_NAME = process.env.AWS_BUCKET!;

const generateFileKey = (fileName: string) => {
  const timestamp = Date.now();
  const randomId = Math.random().toString(36).slice(2, 8);
  const sanitized = fileName.replace(/[^a-zA-Z0-9.-]/g, "_");
  return `profile-pics/${timestamp}-${randomId}-${sanitized}`;
};

export const generateUploadUrlHandler = factory.createHandlers(async (c: Context) => {
  try {
    const reqBody = await c.req.formData();
    const { fileName, fileType, isPublic } = UploadSchema.parse(reqBody);

    const fileKey = generateFileKey(fileName);
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileKey,
      ContentType: fileType,
      ACL: isPublic ? "public-read" : "private",
      Metadata: {
        originalName: fileName,
        generatedAt: new Date().toISOString(),
      },
    });

    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 300 });
    return sendResponse(c, OK, "Upload URL generated successfully", { uploadUrl, fileKey });
  } catch (error) {
    console.error("Error generating upload URL:", error);
    return sendResponse(c, INTERNAL_SERVER_ERROR, "Failed to generate upload URL");
  }
});

export const generateDownloadUrlHandler = factory.createHandlers(async (c: Context) => {
  try {
    const key = c.req.query("key");
    if (!key) {
      return sendResponse(c, BAD_REQUEST, "Missing 'key' query parameter");
    }

    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    const downloadUrl = await getSignedUrl(s3Client, command, { expiresIn: 300 });
    return sendResponse(c, OK, "Download URL generated successfully", { downloadUrl });
  } catch (error) {
    console.error("Error generating download URL:", error);
    return sendResponse(c, INTERNAL_SERVER_ERROR, "Failed to generate download URL");
  }
});
