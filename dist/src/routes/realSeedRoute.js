import factory from "../factory.js";
import { seedRealUserHandler, seedRealProjectHandler, seedCommitHandler, seedRealRepoHandler } from "../handlers/seedRealHandlers";
const seed = factory.createApp();
seed.post("/seed-users", ...seedRealUserHandler);
seed.post("/seed-projects", ...seedRealProjectHandler);
seed.post("/seed-commits", ...seedCommitHandler);
seed.post("/seed-repository", ...seedRealRepoHandler);
export default seed;
