import factory from "../factory.js";
import { assignUsersHandler, createProjectHandlers, getAllProjectsHandlers, getProjectByIdHandlers, getUserByIdHandlers, updateProjectByIdHandlers } from "../handlers/projectHandlers.js";
const projectRoutes = factory.createApp();
projectRoutes.get("/projects/:project_id", ...getProjectByIdHandlers);
projectRoutes.get("/projects", ...getAllProjectsHandlers);
projectRoutes.post("/projects",...createProjectHandlers);
projectRoutes.put("/projects/:project_id",...updateProjectByIdHandlers);
projectRoutes.get("/users/:user_id", ...getUserByIdHandlers);
projectRoutes.post("/projects/usersassign",...assignUsersHandler)


export default projectRoutes;
