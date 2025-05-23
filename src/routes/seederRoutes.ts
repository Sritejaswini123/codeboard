import factory from "../factory.js";
import { seedCommitHandler, seedRealUserBulkDataHandler, seedUserProjectsHandler, seedUsersHandler } from "../handlers/seederHandlers.js";

const seedRoute = factory.createApp();

seedRoute.post("/seed-users", ...seedUsersHandler);
seedRoute.post("/seed-users-json-data", ...seedRealUserBulkDataHandler);
seedRoute.post("/seed-users-projects", ...seedUserProjectsHandler);
seedRoute.post("/seed-commits", ...seedCommitHandler);



export default seedRoute;
