import factory from "../factory.js";
import { createProjectHandlers, getAllProjectsHandlers, userProjectsHandler } from "../handlers/projectHandlers.js";

const projectRoutes = factory.createApp();

projectRoutes.post("/projects", ...createProjectHandlers);
projectRoutes.get("/projects", ...getAllProjectsHandlers);
projectRoutes.get("/user-projects/:id", ...userProjectsHandler)

export default projectRoutes;
