import { ACTIVITIES } from "../../data";
import Avatar from "../avatar";

interface ActivityItemProps {
  activity: (typeof ACTIVITIES)[number];
}

export default function ActivityItem({ activity }: ActivityItemProps) {
  return (
    <div className="flex items-center gap-3">
      <Avatar>{activity.avatar}</Avatar>

      <div className="min-w-0 flex-1">
        <p className="text-xs">
          <strong>{activity.title}</strong>{" "}
          <span className="text-muted-foreground">in {activity.board}</span>
        </p>

        <p className="mt-1 text-[10px] text-muted-foreground">
          {activity.time} ago
        </p>
      </div>
    </div>
  );
}
