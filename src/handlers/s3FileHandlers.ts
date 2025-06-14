import { Context } from "hono";
// import S3FileService from "../services/privateS3FileService";
import S3FileService from "../service/S3FileService";

const s3Service = new S3FileService();
// Handler to get presigned upload URL
export const getUploadUrlHandler = [
  async (c: Context) => {
    const { fileName, fileType } = await c.req.json();

    const result = await s3Service.generateUploadPresignedUrl(fileName, fileType);
    return c.json(result);
  }
];

// Handler to get presigned download URL
export const getDownloadUrlHandler = [
  async (c: Context) => {
    const fileKey = c.req.query("key");

    if (!fileKey) return c.json({ error: "File key is required" }, 400);

    const result = await s3Service.generateDownloadPresignedUrl(fileKey);
    return c.json(result);
  }
];
