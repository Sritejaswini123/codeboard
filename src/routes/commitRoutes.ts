import factory from "../factory.js";
import { createCommitHandlers, getAllCommitsHandlers } from "../handlers/commitHandlers.js";

const commitRoutes = factory.createApp();
commitRoutes.post("/commits", ...createCommitHandlers);
//commitRoutes.get("/users/:user_id", ...getUserByIdHandlers);
commitRoutes.get("/users", ...getAllCommitsHandlers);
// projectRoutes.patch('/users/:user_id',...updateUserByIdHandlers);
// projectRoutes.delete("/users/:user_id", ...deleteUserByIdHandlers);

export default commitRoutes;