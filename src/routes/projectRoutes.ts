import factory from "../factory.js";
import {   getAllProjectsHandlers, getProjectByIdHandlers } from "../handlers/project-handlers.js";

const projectRoutes = factory.createApp();
projectRoutes.get("/projects/:project_id", ...getProjectByIdHandlers);
projectRoutes.get("/projects", ...getAllProjectsHandlers);

export default projectRoutes;
