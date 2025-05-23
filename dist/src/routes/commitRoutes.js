import factory from "../factory.js";
import { createCommitHandlers, getAllCommitsHandlers } from "../handlers/commitHandlers.js";
const commitRoutes = factory.createApp();
commitRoutes.post("/commits", ...createCommitHandlers);
commitRoutes.get("/commits", ...getAllCommitsHandlers);
export default commitRoutes;
