import { Hono } from 'hono';
import { uploadPublicFileHandler } from '../handlers/s3PublicFileHandlers';
const s3PublicRoutes = new Hono();
s3PublicRoutes.post('/upload-public', uploadPublicFileHandler);
export default s3PublicRoutes;
