import factory from "../factory.js";
import { createProjectHandlers, getProjectByIdHandlers } from "../handlers/project-handlers.js";

const projectRoutes = factory.createApp();
projectRoutes.post("/projects", ...createProjectHandlers);
 projectRoutes.get("/users/:user_id", ...getProjectByIdHandlers);
 //projectRoutes.get("/projects", ...getAllProjectsHandlers);
// projectRoutes.patch('/users/:user_id',...updateUserByIdHandlers);
// projectRoutes.delete("/users/:user_id", ...deleteUserByIdHandlers);

export default projectRoutes;
