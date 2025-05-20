import factory from "../factory.js";
import { createCommitHandlers } from "../handlers/commitHandlers.js";

const commitRoutes = factory.createApp();

commitRoutes.post("/save-commits", ...createCommitHandlers);
commitRoutes.get("/commits/:commit-id", ...createCommitHandlers);
export default commitRoutes;
