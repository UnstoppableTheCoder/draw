"use client";

import { ACTIVITIES } from "../../data";
import ActivityHeader from "./header";
import ActivityItem from "./item";

export function ActivityFeed() {
  return (
    <div className="rounded-xl border bg-card p-5 xl:col-span-2">
      <ActivityHeader />

      <div className="mt-4 flex flex-col gap-4">
        {ACTIVITIES.map((activity) => (
          <ActivityItem key={activity.id} activity={activity} />
        ))}
      </div>
    </div>
  );
}
