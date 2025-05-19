import factory from "../factory.js";
import { createProjectHandlers,  getProjectByIdHandlers } from "../handlers/projectHandlers.js";

const projectRoutes = factory.createApp();
projectRoutes.post("/projects", ...createProjectHandlers);
projectRoutes.get("/projects/:project_id", ...getProjectByIdHandlers);
// projectRoutes.get("/projects", ...getAllProjectsHandlers);
// projectRoutes.patch('/projects/:project_id',...updateProjectByIdHandlers);
// projectRoutes.delete("/projects/:project_id", ...deleteProjectByIdHandlers);

export default projectRoutes;
