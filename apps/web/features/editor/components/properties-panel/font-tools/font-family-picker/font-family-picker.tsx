"use client";

import { CaseUpper, Code, Pencil } from "lucide-react";
import { PropertyItem } from "../../property-item";

export const FontFamilyPicker = () => {
  const fontFamily: any = "Arial";

  const styles = [
    {
      value: "Arial",
      icon: <Pencil className="w-4 h-4" />,
      active: fontFamily === "Arial",
    },
    {
      value: "Helvetica",
      icon: <CaseUpper className="w-4 h-4" />,
      active: fontFamily === "Helvetica",
    },
    {
      value: "sans-serif",
      icon: <Code className="w-4 h-4" />,
      active: fontFamily === "sans-serif",
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
