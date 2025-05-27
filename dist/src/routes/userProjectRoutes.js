import factory from "../factory.js";
import { userProfileHandler } from "../handlers/userProjectHandlers.js";
const userProject = factory.createApp();
userProject.get("/users/:id/profile", ...userProfileHandler);
export default userProject;
