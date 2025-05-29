import factory from "../factory.js";
import { createRepositoriesHandlers } from "../handlers/repoHandler";
const repositoryRoutes = factory.createApp();
repositoryRoutes.post("/repository", ...createRepositoriesHandlers);
export default repositoryRoutes;
