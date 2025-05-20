import factory from "../factory.js";
import { createCommitHandlers } from "../handlers/commitHandlers.js";

const projectRoutes = factory.createApp();
// projectRoutes.post("/projects", ...createProjectHandlers);
// projectRoutes.get("/users/:user_id", ...getUserByIdHandlers);
// projectRoutes.get("/users", ...getAllUsersHandlers);
// projectRoutes.patch('/users/:user_id',...updateUserByIdHandlers);
projectRoutes.post("/save-commits", ...createCommitHandlers);

export default projectRoutes;
