import factory from "../factory.js";
import { createProjectHandlers, getAllProjectsHandlers, getProjectByIdHandler, updateproject, userProjectsProfileHandler } from "../handlers/projectHandlers.js";
import { createRepositoriesHandlers, updateRepoByIdHandlers } from "../handlers/repoHandler";

const repositoryRoutes = factory.createApp();

repositoryRoutes.post("/repository", ...createRepositoriesHandlers);

repositoryRoutes.put("/repository/:id", ...updateRepoByIdHandlers);

export default repositoryRoutes;
