"use client";

import { cn } from "@/lib/utils";
import { ReactNode } from "react";

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
    <button
      className={cn(
        data.active
          ? " bg-black/20 text-black"
          : "hover:bg-black/20 bg-black/10",
        "size-8 flex justify-center items-center rounded-sm  cursor-pointer",
      )}
      onClick={() => onClick(data)}
    >
      {data.icon}
    </button>
  );
};
