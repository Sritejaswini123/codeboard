// s3.ts
import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from "uuid";
import "dotenv/config";

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function generateUploadUrl() {
  const key = `profile-pics/${uuidv4()}.jpg`;
  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: key,
    ContentType: "image/jpeg",
  });

  const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 300 });
  return { uploadUrl, key };
}

export async function generateDownloadUrl(key: string) {
  const command = new GetObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: key,
  });

  const downloadUrl = await getSignedUrl(s3Client, command, { expiresIn: 300 }); // 5 minutes
  return downloadUrl;
}