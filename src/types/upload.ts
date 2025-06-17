
export interface UploadRequestBody {
  filename: string;
  contentType: string;
  size: number; // in bytes
}

export interface UploadResponse {
  success: boolean;
  data?: {
    url: string;
    key: string;
  };
  error?: string;
}