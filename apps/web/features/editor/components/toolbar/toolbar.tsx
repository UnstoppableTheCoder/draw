import React from "react";
import ToolbarItems from "./toolbar-items";
import LockButton from "./lock-button";
import MoreTools from "./more-tools";
import { Separator } from "../ui/separator";

const Toolbar = () => {
  return (
    <div className="absolute top-8 left-1/2 -translate-x-1/2 flex gap-1 z-50 select-none bg-white cursor-default w-fit p-1 shadow-spread rounded-md">
      <LockButton />
      <Separator orientation="vertical" />
      <ToolbarItems />
      <Separator orientation="vertical" />
      <MoreTools />
    </div>
  );
};

export default Toolbar;
