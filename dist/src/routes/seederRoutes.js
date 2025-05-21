import factory from "../factory.js";
import { seedUsersHandler } from "../handlers/seederHandlers.js";
import { seedUsersRealDataHandler } from "../jsonData/usersJsonData.js";
const seedRoute = factory.createApp();
seedRoute.post("/seed-users", ...seedUsersHandler);
seedRoute.post("/seed-users-json-data", ...seedUsersRealDataHandler);
export default seedRoute;
