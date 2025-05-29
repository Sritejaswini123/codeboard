<<<<<<< HEAD
"use strict";
// import factory from "../factory.js";
// import { seedProjectHandler, seedUserProjectsHandler, seedUsersHandler } from "../handlers/seederHandlers.js";
// const seedRoute = factory.createApp();
// seedRoute.post("/seed-users", ...seedUsersHandler);
// seedRoute.post("/seed-projects", ...seedProjectHandler);
// seedRoute.post("/seed-user-projects", ...seedUserProjectsHandler);
// // seedRoute.post("/seed-commits", ...seedCommitsHandler);
// // seedRoute.delete("/delete-commit/:id", ...deleteCommitByIdHandler);
// export default seedRoute;
=======
import factory from "../factory.js";
import { seedRealUserBulkDataHandler, seedUserProjectsHandler, seedUsersHandler, } from "../handlers/seederHandlers.js";
const seedRoute = factory.createApp();
seedRoute.post("/seed-users", ...seedUsersHandler);
seedRoute.post("/seed-users-json-data", ...seedRealUserBulkDataHandler);
seedRoute.post("/seed-users-projects", ...seedUserProjectsHandler);
export default seedRoute;
>>>>>>> 017e6737290c9832a0f859a94590d3b404d6e14d
