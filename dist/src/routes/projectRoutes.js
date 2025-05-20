import factory from "../factory.js";
import { delteProjectByIdHandler } from "../handlers/projectHandlers.js";
const projectRoutes = factory.createApp();
// projectRoutes.post("/projects", ...createProjectHandlers);
// projectRoutes.get("/users/:user_id", ...getUserByIdHandlers);
// projectRoutes.get("/users", ...getAllUsersHandlers);
// projectRoutes.patch('/users/:user_id',...updateUserByIdHandlers);
projectRoutes.delete("/projects/:user_id", ...delteProjectByIdHandler);
export default projectRoutes;
