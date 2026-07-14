import { Shape } from "./shape";

export interface Page {
  id: string;
  boardId: string;
  name: string;
  index: number;
  backgroundColor: string | null;
  createdById: string;
  createdAt: string;
  updatedAt: string;
}

export interface PageWithShapes extends Page {
  shapes: Shape[];
}
