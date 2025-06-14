import { getUploadUrlHandler, getDownloadUrlHandler } from "../handlers/s3FileHandlers";
import factory from "../factory.js";

const s3Routes = factory.createApp();

s3Routes.post("/get-upload-url", ...getUploadUrlHandler);
s3Routes.get("/get-download-url", ...getDownloadUrlHandler);

export default s3Routes;