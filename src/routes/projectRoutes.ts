import factory from "../factory.js";
import { createProjectHandlers, getAllProjectsHandlers, getAllUsersByProjectId, getProjectByIdHandler, updateproject, userProjectsProfileHandler } from "../handlers/projectHandlers.js";

const projectRoutes = factory.createApp();

projectRoutes.post("/projects", ...createProjectHandlers);
projectRoutes.get("/projects", ...getAllProjectsHandlers);
projectRoutes.get("/user-projects/:id", ...userProjectsProfileHandler);
projectRoutes.get("/projects/:id", ...getProjectByIdHandler);
projectRoutes.put("/projects/:id", ...updateproject);
projectRoutes.get("/projects-users", ...getAllUsersByProjectId);
projectRoutes.put("/projects/:id", ...updateproject);



export default projectRoutes;
