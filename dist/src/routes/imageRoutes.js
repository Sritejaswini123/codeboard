"use strict";
// // 3. Image Routes (routes/imageRoutes.ts)
// import { Hono } from "hono";
// import { handleImageUpload } from "../handlers/imageController";
// const imageRoutes = new Hono();
// // Test endpoint to debug form data
// imageRoutes.post("/test", async (c) => {
//   try {
//     const body = await c.req.parseBody();
//     return c.json({
//       message: "Test endpoint working",
//       contentType: c.req.header("content-type"),
//       bodyKeys: Object.keys(body),
//       bodyContent: body,
//     });
//   }
//   catch (error) {
//     return c.json({
//       error: "Parse error",
//       details: error instanceof Error ? error.message : "Unknown error",
//     });
//   }
// });
// // Main upload endpoint - using the handleImageUpload handler
// imageRoutes.post("/upload", handleImageUpload);
// export default imageRoutes;
