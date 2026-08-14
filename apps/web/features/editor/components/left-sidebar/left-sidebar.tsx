import {
  LayoutGrid,
  MoreHorizontal,
  PanelLeftClose,
  Plus,
  Search,
  Edit3,
  Copy,
  Trash2,
  Settings,
  Check,
} from "lucide-react";
import { useRef } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import PageActionsMenu from "./page-actions-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Image from "next/image";
import { useBoardActions } from "./use-board-actions";
import { usePageActions } from "./use-page-actions";

function IconButton({
  label,
  children,
  active,
  onClick,
  className,
}: {
  label: string;
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <Button
      aria-label={label}
      title={label}
      onClick={onClick}
      variant={active ? "default" : "ghost"}
      size="icon"
      className={cn("shrink-0", className)}
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
  const {
    boardId,
    pageId,
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
  } = usePageActions();

  const {
    boardName,
    isRenamingBoard,
    saveBoardName,
    handleRenameBoard,
    handleDuplicateBoard,
    handleDeleteBoard,
    handleExportSettings,
  } = useBoardActions();

  const boardInputRef = useRef<HTMLInputElement>(null);

  return (
    /* Wrapper positions the collapse button to the right of the sidebar */
    <div className="relative flex h-full">
      <aside className="border-r flex flex-col w-70 h-full bg-white dark:bg-[#212121]">
        {/* Header */}
        <div className="flex flex-col border-b py-4">
          <div className="flex items-center">
            <Link href={"/dashboard"} className="shrink-0 ml-2 mr-3">
              <Image src={"/logo.png"} width={20} height={20} alt="logo" />
            </Link>

            {/* Board Name / Input */}
            <div className="flex-1 min-w-0">
              {isRenamingBoard ? (
                <input
                  ref={boardInputRef}
                  autoFocus
                  defaultValue={boardName}
                  onBlur={(e) => saveBoardName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") saveBoardName(e.currentTarget.value);
                  }}
                  className="w-full text-base font-bold uppercase tracking-wider bg-transparent outline-none border-b border-primary text-black dark:text-white truncate"
                />
              ) : (
                <button
                  onDoubleClick={handleRenameBoard}
                  title={boardName}
                  className="w-full text-left text-base font-bold uppercase tracking-wider text-black dark:text-white truncate block"
                >
                  {boardName}
                </button>
              )}
            </div>

            <div className="flex items-center gap-1 shrink-0">
              {isRenamingBoard ? (
                <IconButton
                  label="Save board name"
                  onClick={() => {
                    const value = boardInputRef.current?.value ?? boardName!;
                    saveBoardName(value);
                  }}
                >
                  <Check className="size-4" />
                </IconButton>
              ) : (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="size-4 text-muted-foreground" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align="end" className="w-48 p-1">
                    <button
                      onClick={handleRenameBoard}
                      className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted"
                    >
                      <Edit3 className="size-4" />
                      Rename board
                    </button>
                    <button
                      onClick={handleDuplicateBoard}
                      className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted"
                    >
                      <Copy className="size-4" />
                      Duplicate board
                    </button>
                    <button
                      onClick={handleExportSettings}
                      className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted"
                    >
                      <Settings className="size-4" />
                      Export / Settings
                    </button>
                    <div className="my-1 h-px bg-border" />
                    <button
                      onClick={handleDeleteBoard}
                      className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50"
                    >
                      <Trash2 className="size-4" />
                      Delete board
                    </button>
                  </PopoverContent>
                </Popover>
              )}
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
                  {editingPageId === page.id ? (
                    <>
                      <input
                        autoFocus
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        onBlur={() => finishEditing(page.id)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") finishEditing(page.id);
                          if (e.key === "Escape") setEditingPageId(null);
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className="flex-1 bg-transparent outline-none text-sm"
                        onFocus={(e) => e.target.select()}
                      />
                      <button
                        type="button"
                        aria-label="Save page name"
                        title="Save"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={(e) => {
                          e.stopPropagation();
                          finishEditing(page.id);
                        }}
                        className="shrink-0 rounded-md p-1 hover:bg-muted text-muted-foreground hover:text-primary"
                      >
                        <Check className="size-4" />
                      </button>
                    </>
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
                  {page.id === pageId && editingPageId !== page.id && (
                    <span className="size-1.5 rounded-full bg-primary" />
                  )}

                  {editingPageId !== page.id && (
                    <PageActionsMenu
                      editingPageId={editingPageId}
                      pageId={page.id}
                      pageName={page.name}
                      currentBoardId={boardId}
                      onRename={startEditing}
                      onDuplicate={handleDuplicate}
                      onMove={handleMove}
                      onDelete={handleDelete}
                    />
                  )}
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

      {/* Collapse button rendered OUTSIDE the sidebar, on its right edge */}
      <Button
        aria-label="Collapse sidebar"
        title="Collapse sidebar"
        onClick={onCollapse}
        variant={"secondary"}
        className="absolute top-3 -right-10 z-40 shadow-lg md:inline-flex"
      >
        <PanelLeftClose className="size-3.5" />
      </Button>
    </div>
  );
}
