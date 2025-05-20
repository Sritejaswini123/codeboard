import { serve } from "@hono/node-server";

import app from "./app";
import env from "./env";

const port = env.PORT;
const apiVersion = env.API_VERSION;
// const hostname = env.HOST_NAME;



serve({
  fetch: app.fetch,  
  port,
});
console.log(`🚀 Server running at http://localhost:${port}/${apiVersion}/`);

// serve({
//   fetch: app.fetch,
//   port,
//   hostname,
// });
// console.log(` Server running at http://localhost:${port}/${env.API_VERSION}/`);


