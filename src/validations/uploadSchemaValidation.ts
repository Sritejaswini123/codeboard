import { z } from "zod";

// Zod Schemas
export const UploadSchema = z.object({
  fileName: z.string().min(1),
  fileType: z.string().regex(/^[a-z]+\/[a-z0-9.+-]+$/i),
  isPublic: z.boolean().default(false),
});

export const DownloadSchema = z.object({
  fileKey: z.string().min(1), 
});