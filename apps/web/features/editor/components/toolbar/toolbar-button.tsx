"use client";

import { cn } from "@/lib/utils";
import { ToolbarItemType } from "@/features/editor/types/toolbar";
import { JSX } from "react";
import Hint from "../hint";
import { useSelectedTool } from "../../store/editor/selectors";
import useToolActions from "../../interactions/tool/use-tool-actions";
import { Button } from "@/components/ui/button";

type ToolbarButtonProp = {
  item: Omit<ToolbarItemType, "icon"> & { icon: JSX.Element };
};

export const ToolbarButton = ({ item }: ToolbarButtonProp) => {
  const selectedTool = useSelectedTool();
  const { selectTool } = useToolActions();

  return (
    <Hint label={item.label} side="bottom" align="center" sideOffset={10}>
      <Button
        className={cn(
          selectedTool === item.tool
            ? "bg-black/20 dark:bg-[#515151] dark:hover:bg-[#515151]"
            : "dark:hover:bg-[#373737]",
          "active:border active:border-black cursor-pointer",
        )}
        variant={"ghost"}
        onClick={() => selectTool(item.tool)}
      >
        {item.icon}
      </Button>
    </Hint>
  );
};
