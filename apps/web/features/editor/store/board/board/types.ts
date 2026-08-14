export interface Board {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface BoardStore {
  board: Board | null;
  setBoard: (board: Board | null) => void;
  clearBoard: () => void;
}
