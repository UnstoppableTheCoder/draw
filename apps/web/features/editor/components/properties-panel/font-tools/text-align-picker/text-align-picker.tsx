"use client";

import { AlignCenter, AlignLeft, AlignRight } from "lucide-react";
import { PropertyItem } from "../../property-item";
import { RefObject } from "react";

export const TextAlignPicker = ({
  sceneCanvasRef,
}: {
  sceneCanvasRef: RefObject<HTMLCanvasElement | null>;
}) => {
  const iconStyle = "w-4 h-4";
  const textAlign: any = "left";

  const textAlignStyles = [
    {
      label: "Left",
      value: "left",
      icon: <AlignLeft className={iconStyle} />,
    },
    {
      label: "Center",
      value: "center",
      icon: <AlignCenter className={iconStyle} />,
    },

    {
      label: "Right",
      value: "right",
      icon: <AlignRight className={iconStyle} />,
    },
  ];

  return (
    <div className="flex items-center gap-2 py-1">
      {textAlignStyles.map((align, index) => (
        <PropertyItem
          key={index}
          data={{ ...align, active: align.value === textAlign }}
          onClick={() => {}}
        />
      ))}
    </div>
  );
};
