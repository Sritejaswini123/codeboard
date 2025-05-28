import factory from "../factory.js";
import { getDownloadPresignedUrl, getUploadPresignedUrl } from "../handlers/userProfileS3Handlers.js";

const userProfileRoutes = factory.createApp();

userProfileRoutes.put("/users/profile",... getUploadPresignedUrl);
userProfileRoutes.get("/users/profile/:fileKey",... getDownloadPresignedUrl);

export default userProfileRoutes;
