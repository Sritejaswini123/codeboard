// routes/imageRoutes.ts
import { Hono } from 'hono';
import { handleImageUpload } from '../handlers/imageController';
const imageRoutes = new Hono();
imageRoutes.post('/upload', handleImageUpload);
export default imageRoutes;
