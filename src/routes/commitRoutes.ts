import factory from "../factory.js";
import { createCommitHandlers } from "../handlers/commit-handlers.js";

const commitRoutes = factory.createApp();
commitRoutes.post("/commits", ...createCommitHandlers);
// projectRoutes.get("/users/:user_id", ...getUserByIdHandlers);
// projectRoutes.get("/users", ...getAllUsersHandlers);
// projectRoutes.patch('/users/:user_id',...updateUserByIdHandlers);
// projectRoutes.delete("/users/:user_id", ...deleteUserByIdHandlers);

export default commitRoutes;