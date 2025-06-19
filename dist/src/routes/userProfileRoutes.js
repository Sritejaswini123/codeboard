import { uploadHandler, getSignedDownloadUrlHandler, deleteFileHandler } from "../handlers/s3PrivateFileHandlers.js";
import factory from "../factory.js";
import { uploadPublicFileHandler } from "../handlers/s3PublicFileHandlers.js";
const s3Routes = factory.createApp();
s3Routes.post("/get-upload-url", ...uploadHandler);
s3Routes.get("/get-download-url", ...getSignedDownloadUrlHandler);
s3Routes.delete("/delete-file", ...deleteFileHandler);
s3Routes.post('/upload-public', ...uploadPublicFileHandler);
export default s3Routes;
