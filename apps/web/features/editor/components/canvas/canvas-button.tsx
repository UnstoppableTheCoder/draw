"use client";

import { ReactNode } from "react";
import { Button } from "../ui/button";
import Hint from "../hint";
import { cn } from "@/lib/utils";

type CanvasButtonProps = {
  children: ReactNode;
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
};

export default function CanvasButton({
  children,
  label,
  onClick,
  disabled = false,
  className,
}: CanvasButtonProps) {
  return (
    <Hint label={label}>
      <Button
        variant="ghost"
        size="icon"
        disabled={disabled}
        onClick={onClick}
        className={cn(
          "w-10 cursor-pointer rounded-none p-0 hover:bg-neutral-100",
          "disabled:cursor-not-allowed disabled:opacity-40",
          className,
        )}
      >
        {children}
      </Button>
    </Hint>
  );
}
