"use client";

import React from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

const Hint = ({
  label,
  children,
  side,
  align,
  sideOffset,
}: {
  label: string;
  children: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  sideOffset?: number;
}) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side={side} align={align} sideOffset={sideOffset}>
        <p>{label}</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default Hint;
