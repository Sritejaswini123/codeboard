
import { ObjectCannedACL,PutObjectCommand,S3Client} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { s3Config } from '../config/s3Config';



interface Config{
    credentials:{
        accessKeyId: string;
        secretAccessKey: string;
    },
  region: string,
  s3_bucket: string,
  expires: number,
  useAccelerateEndpoint?: boolean;
}


class PublicS3FileService {

  config: Config;
  s3Client: S3Client;
  constructor() {
    this.config = {
      credentials: {
        accessKeyId: s3Config.public_access_key_id,
        secretAccessKey: s3Config.public_secret_access_key
      },
      region: s3Config.buket_region,
      s3_bucket: s3Config.public_bucket,
      expires: 3600
    };
    this.s3Client = new S3Client(this.config);
  }


  generateUploadPresignedUrl = async (fileKey: string, fileType: string) => {

    fileKey = 'code-board/' + fileKey;

    let acl: ObjectCannedACL = "public-read";

    const params = {
      Bucket: s3Config.public_bucket,
      Key: fileKey,
      ContentType: fileType,
      ACL: acl
    };
    
    try {
      const command = new PutObjectCommand(params);
      const presignedUrl = await getSignedUrl(this.s3Client, command, { expiresIn: 3600 });

      return { target_url: presignedUrl, file_key: fileKey };
    } catch (error) {
      console.error("Error generating presigned URL:", error);
      throw error;
    }
  };
}

export default PublicS3FileService;