"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const PropertyItem = ({ data, onClick }: any) => {
  return (
    <Button
      className={cn(data.active ? " bg-black/20 text-black" : "", "size-8")}
      onClick={() => onClick(data.value)}
      variant={"secondary"}
      size={"xs"}
    >
      {data.icon}
    </Button>
  );
};
