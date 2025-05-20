import factory from "../factory.js";
<<<<<<< HEAD
import { createProjectHandlers } from "../handlers/project-handlers.js";
const projectRoutes = factory.createApp();
projectRoutes.post("/projects", ...createProjectHandlers);
=======
const projectRoutes = factory.createApp();
// projectRoutes.post("/projects", ...createProjectHandlers);
>>>>>>> origin/code/refactor
// projectRoutes.get("/users/:user_id", ...getUserByIdHandlers);
// projectRoutes.get("/users", ...getAllUsersHandlers);
// projectRoutes.patch('/users/:user_id',...updateUserByIdHandlers);
// projectRoutes.delete("/users/:user_id", ...deleteUserByIdHandlers);
export default projectRoutes;
