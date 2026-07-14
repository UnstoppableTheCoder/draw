"use client";

import { cn } from "@/lib/utils";
import Hint from "../hint";
import { Button } from "../ui/button";
import { MoreHorizontal } from "lucide-react";

export default function MoreTools() {
  const handleMoreToolsClick = () => {};

  return (
    <Hint label={"more-tools"} side="bottom" align="center" sideOffset={10}>
      <Button
        className={cn(
          false
            ? "bg-black/20 dark:bg-[#515151] dark:hover:bg-[#515151]"
            : "dark:hover:bg-[#373737]",
          "active:border active:border-black cursor-pointer",
        )}
        variant={"ghost"}
        onClick={() => handleMoreToolsClick()}
      >
        {<MoreHorizontal className="size-4" />}
      </Button>
    </Hint>
  );
}
