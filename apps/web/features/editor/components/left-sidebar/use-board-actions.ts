import { updateBoard as updateBoardApi } from "@/features/board/api/board-api";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useBoard } from "../../store/board/board/selectors";
import { useUpdateBoard } from "@/features/board/store/selectors";

export function useBoardActions() {
  const { boardId } = useParams<{ boardId: string }>();
  const router = useRouter();
  const board = useBoard();
  const updateBoard = useUpdateBoard();

  const [isRenamingBoard, setIsRenamingBoard] = useState(false);

  const handleRenameBoard = () => {
    setIsRenamingBoard(true);
  };

  const saveBoardName = async (newName: string) => {
    updateBoard(boardId, { ...board, name: newName });
    setIsRenamingBoard(false);
    await updateBoardApi(boardId, { name: newName });
  };

  const handleDuplicateBoard = async () => {
    try {
      console.log("Duplicating board:", boardId);
      // TODO: Add call to duplicateBoardApi(boardId)
    } catch (err) {
      console.error("Failed to duplicate board", err);
    }
  };

  const handleDeleteBoard = async () => {
    try {
      console.log("Deleting board:", boardId);
      // TODO: Add call to deleteBoardApi(boardId)
      router.push("/dashboard");
    } catch (err) {
      console.error("Failed to delete board", err);
    }
  };

  const handleExportSettings = () => {
    console.log("Open export / settings for board:", boardId);
  };

  return {
    boardId,
    boardName: board?.name,
    isRenamingBoard,
    setIsRenamingBoard,
    handleRenameBoard,
    saveBoardName,
    handleDuplicateBoard,
    handleDeleteBoard,
    handleExportSettings,
  };
}
