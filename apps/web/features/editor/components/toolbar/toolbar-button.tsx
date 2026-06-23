"use client";

import { cn } from "@/lib/utils";
import { ToolbarItemType, ToolType } from "@/types/toolbar.types";
import { JSX } from "react";
import Hint from "../hint";
import { Button } from "../ui/button";
import { useSelectedTool, useSetSelectedTool } from "../../store/selectors";

type ToolbarButtonProp = {
  item: Omit<ToolbarItemType, "icon"> & { icon: JSX.Element };
};

export const ToolbarButton = ({ item }: ToolbarButtonProp) => {
  const selectedTool = useSelectedTool();
  const setSelectedTool = useSetSelectedTool();

  // Sets the tool
  const handleToolSelect = (tool: ToolType) => {
    setSelectedTool(tool);
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
