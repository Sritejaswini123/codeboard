
// import { INTERNAL_SERVER_ERROR, NOT_FOUND } from "../constants/httpStatusCodes";
// import factory from "../factory";
// import UserProfileS3Service from "../s3/userProfileS3Service";

// const userProfileS3Service = new UserProfileS3Service();

// export const getUploadPresignedUrl = factory.createHandlers(async (c) => {
//   try {
//     const { fileName, fileType } = await c.req.json();
//     if (!fileName || !fileType)
//       return c.json({ message:"file name and file type required" }, NOT_FOUND);
//     const { uploadUrl, fileKey } = await userProfileS3Service.generateUploadPresignedUrl(fileName, fileType);
//     return c.json({ uploadUrl, fileKey });
//   }
//   catch (error) {
//     console.error("Error generating upload presigned URL:", error);
//     return c.json({ message: "Failed to generate upload URL" }, INTERNAL_SERVER_ERROR);
//   }
// });

// export const getDownloadPresignedUrl = factory.createHandlers(async (c) => {
//   try {
//     const fileKey = c.req.param("fileKey");
//     if (!fileKey)
//       return c.json({ message: "fileKey is required" }, NOT_FOUND);
//     const downloadUrl = await userProfileS3Service.generateDownloadPresignedUrl(fileKey);
//     return c.json({ downloadUrl });
//   }
//   catch (error) {
//     console.error("Error generating download presigned URL:", error);
//     return c.json({ message: "Failed to generate download URL" }, INTERNAL_SERVER_ERROR);
//   }
// });