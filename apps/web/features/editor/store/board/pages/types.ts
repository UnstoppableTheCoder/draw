// export interface CreatePagePayload {
//   boardId: string;
//   name: string;
//   // icon?: string | null;
//   createdById: string;
//   orderKey: string;
//   backgroundColor: string;
// }

// export interface UpdatePagePayload {
//   name?: string;
//   icon?: string | null;
//   orderKey?: string;
// }

import type { ImageAsset } from "@/features/editor/types";
import { Page } from "@/features/editor/types/page";

export type SetStateAction<T> = T | ((prev: T) => T);
export type ImageMap = Record<string, ImageAsset>;

export interface PageStore {
  // Pages
  pages: Page[];
  currentPageId: string | null;
  setPages: (action: SetStateAction<Page[]>) => void;
  addPage: (page: Page) => void;
  updatePage: (pageId: string, updates: Partial<Page>) => void;
  removePage: (pageId: string) => void;
  reorderPages: (action: SetStateAction<Page[]>) => void;
  setCurrentPageId: (pageId: string | null) => void;

  // Images
  images: ImageMap;
  setImages: (action: SetStateAction<ImageMap>) => void;
  addImage: (image: ImageAsset) => void;
  removeImage: (imageId: string) => void;
  
  // Reset
  clearImages: () => void;
  clear: () => void;
}
