import factory from "../factory.js";
import { seedUsersHandler } from "../handlers/seederHandlers.js";
const seedRoute = factory.createApp();
seedRoute.post('/seed-users', ...seedUsersHandler);
export default seedRoute;
