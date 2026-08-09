import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

export function useBoardActions() {
  const { boardId } = useParams<{ boardId: string }>();
  const router = useRouter();

  const [isRenamingBoard, setIsRenamingBoard] = useState(false);
  const [boardName, setBoardName] = useState("Board");

  const handleRenameBoard = () => {
    setIsRenamingBoard(true);
  };

  const saveBoardName = (newName: string) => {
    setBoardName(newName.trim() || "Untitled Board");
    setIsRenamingBoard(false);
    // TODO: Add call to updateBoardApi(boardId, { name: newName })
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
    boardName,
    setBoardName,
    isRenamingBoard,
    setIsRenamingBoard,
    handleRenameBoard,
    saveBoardName,
    handleDuplicateBoard,
    handleDeleteBoard,
    handleExportSettings,
  };
}
