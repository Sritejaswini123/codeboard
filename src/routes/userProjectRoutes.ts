import factory from "../factory.js";
import { userProfileHandler, userProjectsProfileHandler } from "../handlers/userProjectHandlers";
const userProject = factory.createApp();

userProject.get("/user/:id/profile", ...userProfileHandler);
userProject.get("/user-projects/:id", ...userProjectsProfileHandler);


export default userProject;
