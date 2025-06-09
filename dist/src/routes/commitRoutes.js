import factory from "../factory.js";
import { createCommitHandlers, deleteCommitByIdHandlers, getAllCommitsHandlers, getCommitByIdHandlers, updateCommitByIdHandlers } from "../handlers/commitHandlers.js";
const commitRoutes = factory.createApp();
commitRoutes.post("/commits", ...createCommitHandlers);
commitRoutes.get("/commits", ...getAllCommitsHandlers);
commitRoutes.get("/commits/:commit_id", ...getCommitByIdHandlers);
commitRoutes.put("/commits/:commit_id", ...updateCommitByIdHandlers);
commitRoutes.delete("/commits/:commit_id", ...deleteCommitByIdHandlers);
export default commitRoutes;
