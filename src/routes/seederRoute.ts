import factory from "../factory.js";
import { seedUsersHandler } from "../handlers/seeder-handler.js";


const seedRoute = factory.createApp();

seedRoute.post('/seed-users',...seedUsersHandler);

export default seedRoute;
