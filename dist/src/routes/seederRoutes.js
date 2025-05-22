import factory from "../factory.js";
import { seedRealUserHandler, seedUsersHandler } from "../handlers/seederHandlers.js";
const seedRoute = factory.createApp();
seedRoute.post("/seed-users", ...seedUsersHandler);
seedRoute.post("/seed-users-json-data", ...seedRealUserHandler);
export default seedRoute;
