import factory from "../factory.js";
import { createUserHandlers, deleteUserByIdHandlers, getAllUsersHandlers, getUserByIdHandlers, updateUserByIdHandlers } from "../handlers/userHandlers.js";

const projectRoutes = factory.createApp();
// projectRoutes.post("/projects", ...createProjectHandlers);
// projectRoutes.get("/users/:user_id", ...getUserByIdHandlers);
// projectRoutes.get("/users", ...getAllUsersHandlers);
// projectRoutes.patch('/users/:user_id',...updateUserByIdHandlers);
// projectRoutes.delete("/users/:user_id", ...deleteUserByIdHandlers);

export default projectRoutes;
