import { S3Client, PutObjectCommand, GetObjectCommand, ObjectCannedACL } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { s3Config } from '../config/s3Config';

interface Config {
  credentials: {
    accessKeyId: string;
    secretAccessKey: string;
  };
  region: string;
  s3_bucket: string;
  expires: number;
  useAccelerateEndpoint?: boolean;
}

class UserProfileS3Service {
  config: Config;
  s3Client: S3Client;

  constructor() {
    this.config = {
      credentials: {
        accessKeyId: s3Config.access_key_id,
        secretAccessKey: s3Config.secret_access_key,
      },
      region: s3Config.bucket_region,
      s3_bucket: s3Config.bucket,
      expires: s3Config.expires,
    };
    this.s3Client = new S3Client(this.config);
  }

  generateUploadPresignedUrl = async (fileKey: string, fileType: string) => {
    // Prefix for user profile pictures folder
    fileKey = 'user-profile-pics/' + fileKey;

    const params = {
      Bucket: this.config.s3_bucket,
      Key: fileKey,
      ContentType: fileType,
      ACL: 'private' as ObjectCannedACL,
    };

    try {
      const command = new PutObjectCommand(params);
      const presignedUrl = await getSignedUrl(this.s3Client, command, { expiresIn: this.config.expires });
      return { uploadUrl: presignedUrl, fileKey };
    } catch (error) {
      console.error('Error generating upload presigned URL:', error);
      throw error;
    }
  };

  generateDownloadPresignedUrl = async (fileKey: string) => {
    fileKey = 'user-profile-pics/' + fileKey;

    const params = {
      Bucket: this.config.s3_bucket,
      Key: fileKey,
    };

    try {
      const command = new GetObjectCommand(params);
      const presignedUrl = await getSignedUrl(this.s3Client, command, { expiresIn: this.config.expires });
      return presignedUrl;
    } catch (error) {
      console.error('Error generating download presigned URL:', error);
      throw error;
    }
  };
}

export default UserProfileS3Service;
