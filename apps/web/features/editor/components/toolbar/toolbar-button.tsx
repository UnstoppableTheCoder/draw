"use client";

import Hint from "@/components/hint";
import { Button } from "@/components/ui/button";
import { setTool } from "@/features/toolbar/toolbar-slice";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { cn } from "@/lib/utils";
import { CursorType, ToolbarItemType, ToolType } from "@/types/toolbar.types";
import { JSX } from "react";

type ToolbarButtonProp = {
  item: Omit<ToolbarItemType, "icon"> & { icon: JSX.Element };
};

export const ToolbarButton = ({ item }: ToolbarButtonProp) => {
  const dispatch = useAppDispatch();
  const selectedTool = useAppSelector((state) => state.toolbar.tool);

  // Sets the tool
  const handleToolSelect = (tool: ToolType) => {
    dispatch(setTool({ tool }));
  };

  return (
    <Hint label={item.label} side="bottom" align="center" sideOffset={10}>
      <Button
        className={cn(
          selectedTool === item.tool ? "bg-black/20 hover:bg-black/20 " : "",
          "active:border active:border-black",
        )}
        variant={"ghost"}
        onClick={() => handleToolSelect(item.tool)}
      >
        {item.icon}
      </Button>
    </Hint>
  );
};
