"use client";

import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import Hint from "../hint";

type DataType = {
  label: string;
  value?: string;
  icon: ReactNode;
  active: boolean;
};

type PropertyItemProps = {
  data: DataType;
  onClick: (data: DataType) => void;
};

export const PropertyItem = ({ data, onClick }: PropertyItemProps) => {
  return (
    <Hint label={data.label} side="bottom">
      <button
        className={cn(
          data.active
            ? " bg-black/20 text-black dark:bg-[#515151] dark:text-white"
            : "hover:bg-black/20 bg-black/10 dark:bg-[#333333] dark:hover:bg-[#414141]",
          "size-8 flex justify-center items-center rounded-sm  cursor-pointer",
        )}
        onClick={() => onClick(data)}
      >
        {data.icon}
      </button>
    </Hint>
  );
};
