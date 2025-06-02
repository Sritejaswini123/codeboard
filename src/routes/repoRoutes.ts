import factory from "../factory.js";
import { createProjectHandlers, getAllProjectsHandlers, getProjectByIdHandler, updateproject, userProjectsProfileHandler } from "../handlers/projectHandlers.js";
import { createRepositoriesHandlers, getReopByIdHandler, updateRepoByIdHandlers } from "../handlers/repoHandler";

const repositoryRoutes = factory.createApp();

repositoryRoutes.post("/repository", ...createRepositoriesHandlers);

repositoryRoutes.put("/repository/:id", ...updateRepoByIdHandlers);

repositoryRoutes.get("/repository/:id", ...getReopByIdHandler);


export default repositoryRoutes;
