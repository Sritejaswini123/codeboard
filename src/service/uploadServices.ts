// services/uploadService.ts
import { v2 as cloudinary } from "cloudinary";

import "../libs/cloudinary";

export async function uploadImage(imagePath: string) {
  try {
    const result = await cloudinary.uploader.upload(imagePath, {
      folder: "your_folder_name",
    });

    return result.secure_url;
  }
  catch (error) {
    console.error("Upload failed:", error);
    throw error;
  }
}
