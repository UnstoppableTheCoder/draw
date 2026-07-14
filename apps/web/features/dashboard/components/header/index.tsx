"use client";

import CreateBoardButton from "./create-board-button";
import HelpButton from "./help-button";
import MobileLogo from "./mobile-logo";
import Notifications from "./notifications";
import SearchInput from "./search-input";

interface HeaderProps {
  query: string;
  onQueryChange: (value: string) => void;
  notificationsOpen: boolean;
  onNotificationsOpenChange: (open: boolean) => void;
  onCreateBoard: () => void;
}

export function Header({
  query,
  onQueryChange,
  notificationsOpen,
  onNotificationsOpenChange,
  onCreateBoard,
}: HeaderProps) {
  return (
    <header className="flex h-16 shrink-0 items-center gap-3 border-b bg-card px-4 lg:px-6">
      <MobileLogo />
      <SearchInput value={query} onChange={onQueryChange} />
      <Notifications
        open={notificationsOpen}
        onOpenChange={onNotificationsOpenChange}
      />
      <HelpButton />
      <CreateBoardButton onClick={onCreateBoard} />
    </header>
  );
}
