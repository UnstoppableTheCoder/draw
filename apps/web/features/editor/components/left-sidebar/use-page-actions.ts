import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useUser } from "@/features/auth/store/selectors";
import {
  useAddPage,
  usePages,
  useRemovePage,
  useUpdatePage,
} from "@/features/editor/store/pages/selectors";
import { useClearHistory, useSetShapes } from "../../store/editor/selectors";
import {
  createPageApi,
  deletePageApi,
  duplicatePageApi,
  movePageApi,
  updatePageApi,
} from "../../networking/api/page-api";
import { Page } from "../../types/page";
import { IMAGES_MANIFEST } from "next/constants";

export function usePageActions() {
  const { boardId, pageId } = useParams<{ boardId: string; pageId: string }>();
  const router = useRouter();
  const user = useUser();

  const [editingPageId, setEditingPageId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

  const pages: Page[] = usePages();
  const filteredPages = pages.filter((page) => page.boardId === boardId);

  const addPage = useAddPage();
  const updatePageState = useUpdatePage();
  const removePageState = useRemovePage();
  const setShapes = useSetShapes();
  const clearHistory = useClearHistory();

  const handleCreatePage = async () => {
    try {
      const lastPageOrderKey = pages.at(-1)!.orderKey;

      const { page } = await createPageApi({
        name: "Untitled",
        backgroundColor: "",
        boardId,
        orderKey: lastPageOrderKey,
        createdById: user!.id,
      });

      addPage(page);
      setEditingPageId(page.id);
      setEditingName(page.name);
    } catch (error) {
      console.log("Error creating the page: ", error);
    }
  };

  const startEditing = (id: string, name: string) => {
    setEditingPageId(id);
    setEditingName(name);
  };

  const finishEditing = async (targetPageId: string) => {
    const name = editingName.trim();
    const { page } = await updatePageApi(targetPageId, {
      name: name || "Untitled",
    });

    updatePageState(targetPageId, page);
    setEditingPageId(null);
    router.push(`/board/${boardId}/${page.id}`);
  };

  const handlePageClick = (id: string) => {
    if (pageId !== id) {
      setShapes([]);
      router.push(`/board/${boardId}/${id}`);
    }
  };

  const handleDuplicate = async (id: string) => {
    try {
      setShapes([]);
      clearHistory();

      const { page, imageAssets } = await duplicatePageApi(id);
      console.log({ imageAssets, shapes: page.shapes });
      addPage(page);

      if (page.id) {
        router.push(`/board/${boardId}/${page.id}`);
      }
    } catch (err) {
      console.error("Failed to duplicate page", err);
    }
  };

  const handleMove = async (id: string, targetBoardId: string) => {
    const original = pages.find((p) => p.id === id);
    removePageState(id);

    try {
      const { page } = await movePageApi(id, targetBoardId);
      addPage(page);

      if (id === pageId) {
        const fallback = filteredPages.find((p) => p.id !== id);
        router.push(
          fallback ? `/board/${boardId}/${fallback.id}` : `/board/${boardId}`,
        );
      }
    } catch (err) {
      console.error("Failed to move page", err);
      if (original) addPage(original);
    }
  };

  const handleDelete = async (id: string) => {
    const original = pages.find((page) => page.id === id);
    setShapes([]);
    clearHistory();
    removePageState(id);

    try {
      await deletePageApi(id);

      if (id === pageId) {
        const fallback = filteredPages.find((p) => p.id !== id);
        router.push(
          fallback ? `/board/${boardId}/${fallback.id}` : `/board/${boardId}`,
        );
      }
    } catch (error) {
      console.log("Error deleting the page: ", error);
      if (original) addPage(original);
    }
  };

  return {
    boardId,
    pageId,
    pages,
    filteredPages,
    editingPageId,
    editingName,
    setEditingName,
    setEditingPageId,
    handleCreatePage,
    startEditing,
    finishEditing,
    handlePageClick,
    handleDuplicate,
    handleMove,
    handleDelete,
  };
}
