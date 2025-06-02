import factory from "../factory.js";
import { seedCommitHandler, seedRealProjectHandler, seedRealRepoHandler, seedRealUserHandler, seedUserProjectsHandler } from "../handlers/seedRealHandlers.js";

const seed = factory.createApp();
seed.post("/seed-users", ...seedRealUserHandler);
seed.post("/seed-projects", ...seedRealProjectHandler);
seed.post("/seed-userprojects", ...seedUserProjectsHandler);
seed.post("/seed-commits", ...seedCommitHandler);
seed.post("/seed-repository", ...seedRealRepoHandler);
export default seed;
