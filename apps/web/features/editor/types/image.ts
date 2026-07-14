export interface ImageAsset {
  id: string;
  key?: string; // S3 object key
  renderUrl: string;
  publicUrl?: string; // URL used to load the image
  naturalWidth: number;
  naturalHeight: number;
  status: "uploading" | "uploaded" | "error";
}
