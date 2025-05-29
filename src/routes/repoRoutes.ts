// import factory from "../factory.js";
// import { createRepositoryHandlers } from "../handlers/repoHandlers.js";

// const repoRoutes = factory.createApp();

// repoRoutes.post("/repositories", ...createRepositoryHandlers);

// export default repoRoutes;
import factory from "../factory.js";
import { createRepositoriesHandlers } from "../handlers/repoHandlers.js";

const repoRoutes = factory.createApp();

repoRoutes.post("/repositories", ...createRepositoriesHandlers);


export default repoRoutes;