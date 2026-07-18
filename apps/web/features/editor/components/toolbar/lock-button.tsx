"use client";

import { Button } from "@/components/ui/button";
import { useIsLocked, useSetIsLocked } from "../../store/editor/selectors";
import Hint from "../hint";
import { cn } from "@/lib/utils";
import { Lock, LockOpen } from "lucide-react";

export default function LockButton() {
  const isLocked = useIsLocked();
  const setIsLocked = useSetIsLocked();

  const handleLockSelect = (isLocked: boolean) => {
    setIsLocked(!isLocked);
  };

  return (
    <Hint label={"Lock"} side="bottom" align="center" sideOffset={10}>
      <Button
        className={cn(
          isLocked
            ? "bg-black/20 dark:bg-[#515151] dark:hover:bg-[#515151]"
            : "dark:hover:bg-[#373737]",
          "active:border active:border-black cursor-pointer",
        )}
        variant={"ghost"}
        onClick={() => handleLockSelect(isLocked)}
      >
        {isLocked ? (
          <Lock className="size-4" />
        ) : (
          <LockOpen className="size-4" />
        )}
      </Button>
    </Hint>
  );
}
