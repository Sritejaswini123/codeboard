import factory from "../factory.js";
import { generateUploadUrlHandler } from "../s3/profileUpload.js";

const userProfileRoutes = factory.createApp();

userProfileRoutes.put("/users/profile-upload", ...generateUploadUrlHandler);

export default userProfileRoutes;
