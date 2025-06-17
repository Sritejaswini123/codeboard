import { uploadHandler, getSignedDownloadUrlHandler, deleteFileHandler } from "../handlers/s3PrivateFileHandlers.js";
import factory from "../factory.js";
const s3Routes = factory.createApp();
s3Routes.post("/get-upload-url", uploadHandler);
s3Routes.get("/get-download-url", getSignedDownloadUrlHandler);
s3Routes.delete("/delete-file", deleteFileHandler);
export default s3Routes;
