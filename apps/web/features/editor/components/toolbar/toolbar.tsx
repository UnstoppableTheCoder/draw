import React from "react";
import ToolbarItems from "./toolbar-items";
import LockButton from "./lock-button";
import MoreTools from "./more-tools";
import { Separator } from "@/components/ui/separator";

const Toolbar = () => {
  return (
    <div className="absolute top-5 left-1/2 -translate-x-1/2 flex gap-1 z-50 select-none bg-white dark:bg-[#212121] border cursor-default w-fit p-1 shadow-spread rounded-md">
      <LockButton />
      <Separator orientation="vertical" />
      <ToolbarItems />
      <Separator orientation="vertical" />
      <MoreTools />
    </div>
  );
};

export default Toolbar;
