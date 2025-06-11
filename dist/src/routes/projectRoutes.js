import factory from "../factory.js";
import { assignUsersHandler, createProjectHandlers, deleteAssignUsersHandler, getAllProjectsHandlers, userProjectsHandler } from "../handlers/projectHandlers.js";
const projectRoutes = factory.createApp();
projectRoutes.delete("/projects/assign", ...deleteAssignUsersHandler);
projectRoutes.post("/projects", ...createProjectHandlers);
projectRoutes.post("/projects/assign", ...assignUsersHandler);
projectRoutes.get("/projects", ...getAllProjectsHandlers);
projectRoutes.get("/user-projects/:id", ...userProjectsHandler);
export default projectRoutes;
