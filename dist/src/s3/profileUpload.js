import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { z } from "zod";
import { FILE_UPLOADED } from "../constants/appMessages";
import { BAD_REQUEST, CREATED } from "../constants/httpStatusCodes";
import factory from "../factory";
import { sendResponse } from "../utils/sendResponse";
import { UploadSchema } from "../validations/uploadSchemaValidation";
const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY,
    },
});
const generateFileKey = (fileName) => {
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).slice(2, 8);
    const sanitized = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
    return `shared/${timestamp}-${randomId}-${sanitized}`;
};
const BUCKET_NAME = process.env.AWS_BUCKET;
export const generateUploadUrlHandler = factory.createHandlers(async (c) => {
    try {
        const reqBody = await c.req.formData();
        console.log("hello------->1", reqBody);
        const { fileName, fileType, isPublic } = UploadSchema.parse(reqBody);
        console.log("hello------->", reqBody);
        const fileKey = generateFileKey(fileName);
        const command = new PutObjectCommand({
            Bucket: BUCKET_NAME,
            Key: fileKey,
            ContentType: fileType,
            ACL: isPublic ? 'public-read' : 'private', //access control list
            Metadata: {
                originalName: fileName,
                generatedAt: new Date().toISOString(),
            },
        });
        const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 300 });
        return sendResponse(c, CREATED, FILE_UPLOADED, { uploadUrl, fileKey });
    }
    catch (error) {
        if (error instanceof z.ZodError) {
            return sendResponse(c, BAD_REQUEST, 'INVALID_INPUT', {
                errors: error.errors.map(e => ({
                    field: e.path.join('.'),
                    message: e.message
                }))
            });
        }
        throw error;
    }
});
