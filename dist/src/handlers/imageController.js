"use strict";
// // import { Context } from 'hono';
// // import { uploadImage } from '../service/uploadServices';
// // import db from '../database/db';
// // import { userProfiles } from '../database/schemas/userProfiles';
// // export const handleImageUpload = async (c: Context) => {
// //   const body = await c.req.parseBody();
// //   const file = body.File as File;
// //   if (!file) {
// //     return c.json({ error: 'No file provided' }, 400);
// //   }
// //   const buffer = await file.arrayBuffer();
// //   const base64 = Buffer.from(buffer).toString('base64');
// //   const dataUri = `data:${file.type};base64,${base64}`;
// //   const url = await uploadImage(dataUri);
// //   await db.insert(userProfiles).values({ imageUrl: url });
// //   return c.json({ imageUrl: url });
// //   console.log(body);
// // };
// // 2. Updated Image Controller (handlers/imageController.ts)
// import type { Context } from "hono";
// import db from "../database/db";
// import { userProfiles } from "../database/schemas/userProfiles";
// import { uploadImage } from "../service/uploadServices";
// export async function handleImageUpload(c: Context) {
//   try {
//     const body = await c.req.parseBody();
//     const file = body.file as File;
//     if (!file) {
//       return c.json({ error: "No file provided" }, 400);
//     }
//     // Validate file type
//     const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
//     if (!allowedTypes.includes(file.type)) {
//       return c.json({
//         error: "Invalid file type. Only images (JPEG, PNG, WebP, GIF) are allowed.",
//       }, 400);
//     }
//     console.log("File details:", {
//       name: file.name,
//       type: file.type,
//     });
//     // Convert file to base64 string before uploading
//     const buffer = await file.arrayBuffer();
//     const base64 = Buffer.from(buffer).toString("base64");
//     const dataUri = `data:${file.type};base64,${base64}`;
//     console.log("Uploading to Cloudinary...");
//     const imageUrl = await uploadImage(dataUri);
//     console.log("Upload successful:", imageUrl);
//     // Save to database
//     const result = await db.insert(userProfiles).values({ imageUrl }).returning();
//     console.log("Database entry created:", result);
//     return c.json({
//       success: true,
//       imageUrl,
//       fileInfo: {
//         name: file.name,
//         type: file.type,
//       },
//       // cloudinaryUrl: imageUrl
//     });
//   }
//   catch (error) {
//     console.error("Upload error:", error);
//     return c.json({
//       error: "Upload failed",
//       details: error instanceof Error ? error.message : "Unknown error",
//     }, 500);
//   }
// }
