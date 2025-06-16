import factory from "../factory.js";
import { getUserProfileDownloadUrlHandler, getUserProfileUploadUrlHandler } from "../handlers/userProfileS3Handlers.js";

const userProfileRoutes = factory.createApp();

userProfileRoutes.put("/upload-url", ...getUserProfileUploadUrlHandler);
userProfileRoutes.get("/download-url", ...getUserProfileDownloadUrlHandler);


export default userProfileRoutes;
