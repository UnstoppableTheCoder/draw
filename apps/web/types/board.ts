export interface Board {
  id: string;
  name: string;
  description: string | null;
  thumbnail: string | null;
  isPublic: boolean;
  favorite: boolean;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}
