"use client";

import { Header } from "./components/header";
import { Hero } from "./components/hero";
import { useDashboard } from "./hooks/use-dashboard";
import { Sidebar } from "./components/sidebar";
import { UpcomingCall } from "./components/upcoming-call";
import { BoardList } from "./components/board/list";
import { ActivityFeed } from "./components/activity-feed";
import Templates from "./components/templates";
import { CreateBoardDialog } from "./components/create-board-dialog";

export default function DashboardPage() {
  const {
    boards,
    collapsed,
    query,
    filter,
    listView,
    notificationsOpen,
    createBoardOpen,
    setCollapsed,
    setQuery,
    setFilter,
    setListView,
    setNotificationsOpen,
    setCreateBoardOpen,
  } = useDashboard();

  return (
    <>
      <main className="flex h-dvh overflow-hidden bg-background text-foreground">
        <Sidebar collapsed={collapsed} onCollapsedChange={setCollapsed} />
        <div className="flex min-w-0 flex-1 flex-col">
          <Header
            query={query}
            onQueryChange={setQuery}
            notificationsOpen={notificationsOpen}
            onNotificationsOpenChange={setNotificationsOpen}
            onCreateBoard={() => setCreateBoardOpen(true)}
          />
          <div className="flex-1 overflow-y-auto">
            <div className="mx-auto flex max-w-[1500px] flex-col gap-8 p-5 lg:p-8">
              <Hero />
              <Templates />
              <BoardList
                boards={boards}
                filter={filter}
                onFilterChange={setFilter}
                listView={listView}
                onListViewChange={setListView}
              />
              <section className="grid gap-4 xl:grid-cols-3">
                <ActivityFeed />
                <UpcomingCall />
              </section>
            </div>
          </div>
        </div>
      </main>

      <CreateBoardDialog
        open={createBoardOpen}
        onOpenChange={setCreateBoardOpen}
      />
    </>
  );
}
