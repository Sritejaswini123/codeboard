import { uploadHandler, getSignedDownloadUrlHandler } from "../handlers/s3PrivateFileHandlers.js";
import factory from "../factory.js";
const s3Routes = factory.createApp();
s3Routes.post("/get-upload-url", uploadHandler);
s3Routes.get("/get-download-url", getSignedDownloadUrlHandler);
export default s3Routes;
