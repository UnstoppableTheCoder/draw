"use client";

import { useIsLocked, useSetIsLocked } from "../../store/selectors";
import Hint from "../hint";
import { Button } from "../ui/button";
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
          isLocked ? "bg-black/20 hover:bg-black/20 " : "",
          "active:border active:border-black",
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
