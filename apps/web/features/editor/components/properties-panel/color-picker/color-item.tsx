"use client";

import { cn } from "@/lib/utils";

interface ColorItemProps {
  color: string;
  onClick?: (value: string) => void;
  size: "sm" | "lg";
  active?: boolean;
}

export const ColorItem = ({ color, onClick, size = "sm" }: ColorItemProps) => {
  return (
    <button
      onClick={onClick ? () => onClick(color) : undefined}
      style={{ backgroundColor: color }}
      className={cn(
        "rounded-sm border-gray-300 border-1 transition duration-150 relative hover:scale-105 cursor-pointer",
        size === "sm" ? "size-6" : "size-7",
      )}
    />
  );
};
