import {
  LayoutGrid,
  MoreHorizontal,
  PanelLeftClose,
  Plus,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  useAddPage,
  usePages,
  useUpdatePage,
} from "@/features/page/store/selectors";
import { useState } from "react";
import { createPage, updatePage } from "@/features/page/api/page-api";
import { useUser } from "@/features/auth/store/selectors";
import { useCanvasRenderer } from "../../context/use-renderer";
import { getNextZIndex } from "../../utils/shape-z-index";
import { Page } from "../../types/page";

function IconButton({
  label,
  children,
  active,
  onClick,
}: {
  label: string;
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <Button
      aria-label={label}
      title={label}
      onClick={onClick}
      variant={active ? "default" : "ghost"}
      size="icon"
      className="shrink-0"
    >
      {children}
    </Button>
  );
}

export default function LeftSidebar({
  onCollapse,
}: {
  onCollapse: () => void;
}) {
  const { boardId, pageId } = useParams<{ boardId: string; pageId: string }>();

  const [editingPageId, setEditingPageId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const addPage = useAddPage();
  const user = useUser();
  const updatePageState = useUpdatePage();
  const router = useRouter();

  const pages: Page[] = usePages();
  const filteredPages = pages.filter((page) => page.boardId === boardId);

  const handleCreatePage = async () => {
    const lastPageOrderKey = pages.at(-1)?.orderKey!;

    const { page } = await createPage({
      name: "Untitled",
      backgroundColor: "",
      boardId,
      orderKey: lastPageOrderKey,
      createdById: user!.id,
    });

    // Zustand action
    addPage(page);
    setEditingPageId(page.id);
    setEditingName(page.name);
  };

  const startEditing = (id: string, name: string) => {
    setEditingPageId(id);
    setEditingName(name);
  };

  const finishEditing = async (pageId: string) => {
    console.log("Finishing editing");
    const name = editingName.trim();

    const { page } = await updatePage(pageId, {
      name: name || "Untitled",
    });

    updatePageState(pageId, page);
    setEditingPageId(null);
  };

  const handlePageClick = (pageId: string) => {
    router.push(`/board/${boardId}/${pageId}`);
  };

  return (
    <aside className="border-r flex flex-col w-56 h-full bg-white dark:bg-[#212121]">
      {/* Header */}
      <div className="flex flex-col border-b p-4">
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold uppercase tracking-wider text-black dark:text-white">
            <Link href={"/dashboard"}>Board</Link>
          </span>
          <div className="flex items-center gap-1">
            <IconButton label="Collapse sidebar" onClick={onCollapse}>
              <PanelLeftClose className="size-4" />
            </IconButton>
            <MoreHorizontal className="size-4 text-muted-foreground" />
          </div>
        </div>
      </div>

      {/* Page Section */}
      <div className="flex min-h-0 flex-1 flex-col gap-2 p-3">
        <div className="flex items-center justify-between px-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Pages
          </span>
          <Search className="size-4 text-muted-foreground" />
        </div>

        {/* Scrollable List */}
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <div
            className="flex flex-col gap-1"
            onWheel={(e) => e.stopPropagation()}
          >
            {filteredPages.map((page, index) => (
              <div
                key={index}
                onClick={() => handlePageClick(page.id)}
                className={cn(
                  "group flex h-9 items-center gap-2 rounded-lg px-2 text-left text-sm transition-colors hover:bg-sidebar-accent",
                  page.id === pageId &&
                    "bg-sidebar-accent text-sidebar-accent-foreground",
                )}
              >
                <LayoutGrid
                  className={cn(
                    "size-4 text-muted-foreground",
                    page.id === pageId && "text-primary",
                  )}
                />
                {/* Page Name */}
                {editingPageId === page.id ? (
                  <input
                    autoFocus
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    onBlur={() => finishEditing(page.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        finishEditing(page.id);
                      }
                      if (e.key === "Escape") {
                        setEditingPageId(null);
                      }
                    }}
                    className="flex-1 bg-transparent outline-none text-sm"
                    onFocus={(e) => e.target.select()}
                  />
                ) : (
                  <span
                    className="flex-1 truncate"
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      startEditing(page.id, page.name);
                    }}
                  >
                    {page.name}
                  </span>
                )}
                {page.id === pageId && (
                  <span className="size-1.5 rounded-full bg-primary" />
                )}
                <MoreHorizontal className="size-4 opacity-0 group-hover:opacity-100" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t p-3">
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={handleCreatePage}
        >
          <Plus data-icon="inline-start" />
          New page
        </Button>
      </div>
    </aside>
  );
}
