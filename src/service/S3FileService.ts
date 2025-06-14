import { PutObjectCommand, S3Client, ObjectCannedACL , GetObjectCommand} from '@aws-sdk/client-s3';
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

class S3FileService {
  private config: Config;
  private s3Client: S3Client;

  constructor() {
    this.config = {
      credentials: {
        accessKeyId: s3Config.access_key_id,
        secretAccessKey: s3Config.secret_access_key,
      },
      region: s3Config.bucket_region, // fixed typo here (was buket_region)
      s3_bucket: s3Config.bucket,
      expires: s3Config.expires || 3600,
    };

    this.s3Client = new S3Client({
      region: this.config.region,
      credentials: this.config.credentials,
    });
  }

  /**
   * Generate a signed PUT URL for uploading a file privately.
   * @param originalFileName filename (e.g., image.png)
   * @param fileType content type (e.g., image/png)
   */
  async generateUploadPresignedUrl(originalFileName: string, fileType: string) {
    const timestamp = Date.now();
    const fileKey = `userprofile/${timestamp}_${originalFileName}`;

    const params = {
      Bucket: this.config.s3_bucket,
      Key: fileKey,
      ContentType: fileType,
     ACL: ObjectCannedACL.private // ✅ proper type from enum

    };

    try {
      const command = new PutObjectCommand(params);
      const presignedUrl = await getSignedUrl(this.s3Client, command, {
        expiresIn: this.config.expires,
      });

      return { uploadUrl: presignedUrl, key: fileKey };
    } catch (error) {
      console.error("Failed to generate upload URL:", error);
      throw error;
    }
  }

  /**
   * Generate a signed GET URL for downloading a private file
   * @param fileKey S3 key from upload (e.g., userprofile/12345_image.png)
   */
  async generateDownloadPresignedUrl(fileKey: string) {
    const params = {
      Bucket: this.config.s3_bucket,
      Key: fileKey,
    };

    try {
      const command = new GetObjectCommand(params);
      const downloadUrl = await getSignedUrl(this.s3Client, command, {
        expiresIn: this.config.expires,
      });

      return { downloadUrl };
    } catch (error) {
      console.error("Failed to generate download URL:", error);
      throw error;
    }
  }
}

export default S3FileService;
