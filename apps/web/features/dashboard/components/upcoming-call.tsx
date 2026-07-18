"use client";

import { Button } from "@/components/ui/button";
import { ChevronDown, Video } from "lucide-react";

export function UpcomingCall() {
  return (
    <div className="rounded-xl border bg-card p-5">
      <CallHeader />
      <CallContent />
      <CallActions />
    </div>
  );
}

function CallHeader() {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-sm font-semibold">Upcoming call</h2>

      <Video className="size-4 text-primary" />
    </div>
  );
}

function CallContent() {
  return (
    <>
      <p className="mt-5 text-lg font-semibold">Weekly product sync</p>

      <p className="mt-1 text-xs text-muted-foreground">
        Today · 2:30 PM · 6 people
      </p>
    </>
  );
}

function CallActions() {
  return (
    <div className="mt-5 flex gap-2">
      <Button className="flex-1">Join call</Button>

      <Button variant="outline" size="icon" aria-label="Call options">
        <ChevronDown />
      </Button>
    </div>
  );
}
