"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { FilePlus2, LayoutDashboard, PlusCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getBoard } from "@/features/board/api/board-api";
import { createPageApi } from "@/features/editor/networking/api/page-api";
import { useUser } from "@/features/auth/store/selectors";
import { getNextZIndex } from "@/features/editor/utils/z-index";
import { CreateBoardDialog } from "@/components/create-board-dialog";

// ---- Types ----
type BoardType = {
  id: string;
  name: string;
};

type Page = {
  id: string;
  name: string;
  boardId: string;
};

// ---- Page ----
export default function Board() {
  const router = useRouter();
  const { boardId } = useParams<{ boardId: string }>();

  const [openCreateBoard, setOpenCreateBoard] = useState(false);
  const [status, setStatus] = useState<
    "loading" | "not-found" | "empty" | "ready"
  >("loading");

  const [board, setBoard] = useState<BoardType | null>(null);
  const [pages, setPages] = useState<Page[]>([]);
  const [busy, setBusy] = useState(false);
  const user = useUser();

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!boardId) {
        setStatus("not-found");
        return;
      }

      setStatus("loading");
      try {
        const { board, pages } = await getBoard(boardId);
        if (cancelled) return;

        if (!board) {
          setStatus("not-found");
          return;
        }

        setBoard(board);
        setPages(pages);

        if (pages.length === 0) {
          setStatus("empty");
        } else {
          // If pages exist, jump to the first one
          router.replace(`/board/${boardId}/page/${pages[0]?.id}`);
          setStatus("ready");
        }
      } catch {
        if (!cancelled) setStatus("not-found");
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [boardId, router]);

  async function handleCreatePage() {
    if (!boardId) return;
    try {
      setBusy(true);
      const { page } = await createPageApi({
        boardId,
        name: "New Page",
        createdById: user!.id,
        orderKey: getNextZIndex(null),
        backgroundColor: "",
      });

      if (page) {
        router.push(`/board/${boardId}/page/${page.id}`);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setBusy(false);
    }
  }

  // ---- UI ----
  const renderContent = () => {
    if (status === "loading") {
      return (
        <div className="flex h-full w-full items-center justify-center">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      );
    }

    if (status === "not-found") {
      return (
        <EmptyState
          icon={<LayoutDashboard className="size-8 text-muted-foreground" />}
          title="Board does not exist"
          description="The board you're looking for was deleted or never existed. Create a new board to get started."
          actionLabel="Create new board"
          actionIcon={<PlusCircle className="size-4" />}
          onAction={() => setOpenCreateBoard(true)}
          busy={busy}
          secondary={{
            label: "Go to dashboard",
            onClick: () => router.push("/dashboard"),
          }}
        />
      );
    }

    if (status === "empty") {
      return (
        <EmptyState
          icon={<FilePlus2 className="size-8 text-muted-foreground" />}
          title={`No pages in ${board?.name ?? "this board"}`}
          description="You've deleted all pages. Create a new page to start building on this board."
          actionLabel="Create new page"
          actionIcon={<PlusCircle className="size-4" />}
          onAction={handleCreatePage}
          busy={busy}
        />
      );
    }

    return null;
  };

  return (
    <>
      <div className="h-screen w-screen flex justify-center items-center">
        {renderContent()}
      </div>

      {/* Create Board modal */}
      <CreateBoardDialog
        open={openCreateBoard}
        onOpenChange={setOpenCreateBoard}
      />
    </>
  );
}

// ---- Reusable empty state ----
function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  actionIcon,
  onAction,
  busy,
  secondary,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionLabel: string;
  actionIcon?: React.ReactNode;
  onAction: () => void;
  busy?: boolean;
  secondary?: { label: string; onClick: () => void };
}) {
  return (
    <div className="flex h-full w-full items-center justify-center p-8">
      <div className="flex max-w-md flex-col items-center text-center">
        <div className="mb-4 flex size-16 items-center justify-center rounded-2xl border bg-muted/40">
          {icon}
        </div>
        <h2 className="mb-2 text-xl font-semibold text-foreground">{title}</h2>
        <p className="mb-6 text-sm text-muted-foreground">{description}</p>

        <div className="flex items-center gap-2">
          <Button onClick={onAction} disabled={busy}>
            {busy ? <Loader2 className="size-4 animate-spin" /> : actionIcon}
            {actionLabel}
          </Button>
          {secondary && (
            <Button variant="ghost" onClick={secondary.onClick}>
              {secondary.label}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
