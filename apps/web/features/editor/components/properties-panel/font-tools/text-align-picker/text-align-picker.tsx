"use client";

import { AlignCenter, AlignLeft, AlignRight } from "lucide-react";
import { PropertyItem } from "../../property-item";

export const TextAlignPicker = () => {
  const iconStyle = "w-4 h-4";
  const textAlign: any = "left";

  const styles = [
    {
      value: "left",
      icon: <AlignLeft className={iconStyle} />,
      active: textAlign === "left",
    },
    {
      value: "center",
      icon: <AlignCenter className={iconStyle} />,
      active: textAlign === "center",
    },

    {
      value: "right",
      icon: <AlignRight className={iconStyle} />,
      active: textAlign === "right",
    },
  ];

  return (
    <div className="flex items-center gap-2 py-1">
      {styles.map((style) => (
        <PropertyItem key={style.value} data={style} onClick={() => {}} />
      ))}
    </div>
  );
};
