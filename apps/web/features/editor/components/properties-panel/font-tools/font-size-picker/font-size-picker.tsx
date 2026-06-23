"use client";

import { PropertyItem } from "../../property-item";

export const FontSizePicker = () => {
  const fontSize: any = 18;

  const styles = [
    {
      value: 18,
      icon: "S",
      active: fontSize === 18,
    },
    {
      value: 20,
      icon: "M",
      active: fontSize === 20,
    },

    {
      value: 24,
      icon: "L",
      active: fontSize === 24,
    },
    {
      value: 26,
      icon: "XL",
      active: fontSize === 26,
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
