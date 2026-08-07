export interface ImageAsset {
  id: string;
  pageId: string;
  uploadedById: string;
  s3Key?: string;
  renderUrl: string;
  publicUrl?: string; // URL used to load the image
  mimeType?: string;
  fileSize?: string;
  naturalWidth: number;
  naturalHeight: number;
  status: "uploading" | "uploaded" | "error";
}
