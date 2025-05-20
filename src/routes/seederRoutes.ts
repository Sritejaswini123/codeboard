import factory from "../factory.js";
import { insertUserProjectsHandler, seedUsersHandler } from "../handlers/seederHandlers.js";


const seedRoute = factory.createApp();

seedRoute.post('/seed-users',...seedUsersHandler);
seedRoute.post('/seed-user-projects',...insertUserProjectsHandler);


export default seedRoute;
