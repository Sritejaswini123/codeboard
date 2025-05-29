import factory from "../factory.js";
import { createProjectHandlers, getAllProjectsHandlers, getProjectByIdHandler, updateproject, userProjectsProfileHandler } from "../handlers/projectHandlers.js";
import { createRepositoriesHandlers } from "../handlers/repositoriesHandler.js";

const repositoryRoutes = factory.createApp();

repositoryRoutes.post("/repository", ...createRepositoriesHandlers);


export default repositoryRoutes;
