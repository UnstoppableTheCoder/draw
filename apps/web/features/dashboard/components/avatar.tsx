import { cn } from "@/lib/utils";

interface AvatarProps {
  children: string;
  className?: string;
}

export default function Avatar({ children, className }: AvatarProps) {
  return (
    <div
      className={cn(
        "flex size-7 items-center justify-center rounded-full border-2 border-card bg-secondary text-[9px] font-bold",
        className,
      )}
    >
      {children}
    </div>
  );
}
