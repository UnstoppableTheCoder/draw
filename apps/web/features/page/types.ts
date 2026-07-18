export interface Page {
  id: string;
  boardId: string;
  name: string;
  // icon: string | null;
  createdById: string;
  backgroundColor?: string;
  orderKey: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePagePayload {
  boardId: string;
  name: string;
  // icon?: string | null;
  createdById: string;
  orderKey: string;
  backgroundColor: string;
}

export interface UpdatePagePayload {
  name?: string;
  icon?: string | null;
  orderKey?: string;
}
