import factory from "../factory";
import { createRepositoriesHandlers, getAllReposHandlers, updateRepoByIdHandlers } from "../handlers/repositoryHandlers";
const repositoryRoutes = factory.createApp();
repositoryRoutes.post("/repos", ...createRepositoriesHandlers);
repositoryRoutes.get("/repos", ...getAllReposHandlers);
// repositoryRoutes.get("/repos/:repo_id", ...getRepoByIdHandlers);
repositoryRoutes.patch("/repos/:repo_id", ...updateRepoByIdHandlers);
// repositoryRoutes.delete("/repos/:repo_id", ...deleteRepoHandlers);
export default repositoryRoutes;
