import factory from "../factory.js";
import {   createProjectHandlers, getAllProjectsHandlers, getProjectByIdHandlers, updateprojectByIdHandlers } from "../handlers/projectHandlers.js"
const projectRoutes = factory.createApp();
projectRoutes.get("/projects/:project_id", ...getProjectByIdHandlers);
projectRoutes.get("/projects", ...getAllProjectsHandlers);
projectRoutes.post("/projects",...createProjectHandlers);
projectRoutes.put("/projects/:project_id",...updateprojectByIdHandlers)

export default projectRoutes;
