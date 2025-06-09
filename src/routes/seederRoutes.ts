import factory from "../factory.js";
import {seedRealUserBulkDataHandler,seedUserProjectsHandler,seedUsersHandler,} from "../handlers/seederHandlers.js";

const seedRoute = factory.createApp();

seedRoute.post("/seed-users", ...seedUsersHandler);
seedRoute.post("/seed-users-json-data", ...seedRealUserBulkDataHandler);
seedRoute.post("/seed-users-projects", ...seedUserProjectsHandler);

export default seedRoute;
