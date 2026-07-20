import { Shape } from "./shape";

export interface Page {
  id: string;
  boardId: string;
  name: string;
  orderKey: string;
  backgroundColor?: string;
  createdById: string;
  createdAt: string;
  updatedAt: string;
}

export interface PageWithShapes extends Page {
  shapes: Shape[];
}
