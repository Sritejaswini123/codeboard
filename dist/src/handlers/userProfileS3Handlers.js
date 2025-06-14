import { FILE_NAME_TYPE_REQUIRED, FILE_TYPE_REQUIRED } from "../constants/appMessages";
import { NOT_FOUND } from "../constants/httpStatusCodes";
import factory from "../factory";
import UserProfileS3Service from "../s3/userProfileS3Service";
import NotFoundException from "../exceptions/notFoundException";
const userProfileS3Service = new UserProfileS3Service();
export const getUploadPresignedUrl = factory.createHandlers(async (c) => {
    try {
        const { fileName, fileType } = await c.req.json();
        if (!fileName || !fileType) {
            throw new NotFoundException(FILE_NAME_TYPE_REQUIRED, NOT_FOUND);
        }
        const { uploadUrl, fileKey } = await userProfileS3Service.generateUploadPresignedUrl(fileName, fileType);
        return c.json({ uploadUrl, fileKey });
    }
    catch (error) {
        console.error("Error generating upload presigned URL:", error);
        throw error;
    }
});
export const getDownloadPresignedUrl = factory.createHandlers(async (c) => {
    try {
        const fileKey = c.req.param("fileKey");
        if (!fileKey) {
            throw new NotFoundException(FILE_TYPE_REQUIRED, NOT_FOUND);
        }
        const downloadUrl = await userProfileS3Service.generateDownloadPresignedUrl(fileKey);
        return c.json({ downloadUrl });
    }
    catch (error) {
        console.error("Error generating download presigned URL:", error);
        throw error;
    }
});
