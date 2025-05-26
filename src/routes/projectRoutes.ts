import factory from "../factory.js";
import { createProjectHandlers, deleteProjectByIdHandlers, getAllProjectsHandlers, getProjectByIdHandlers, updateProjectByIdHandlers } from "../handlers/projectHandlers.js";
const projectRoutes = factory.createApp();
projectRoutes.get("/projects/:project_id", ...getProjectByIdHandlers);
projectRoutes.get("/projects", ...getAllProjectsHandlers);
projectRoutes.post("/projects",...createProjectHandlers);
projectRoutes.put("/projects/:project_id",...updateProjectByIdHandlers);
projectRoutes.delete("/projects/:project_id",...deleteProjectByIdHandlers);


export default projectRoutes;
