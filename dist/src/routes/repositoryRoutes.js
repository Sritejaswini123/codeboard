import factory from "../factory.js";
import { createRepositoriesHandlers } from "../handlers/repositoriesHandlers.js";
const repositoryRoutes = factory.createApp();
repositoryRoutes.post("/repository", ...createRepositoriesHandlers);
export default repositoryRoutes;
