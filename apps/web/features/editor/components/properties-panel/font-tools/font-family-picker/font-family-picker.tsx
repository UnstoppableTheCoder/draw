"use client";

import { CaseUpper, Code, Pencil } from "lucide-react";
import { PropertyItem } from "../../property-item";
import { RefObject } from "react";

export const FontFamilyPicker = ({
  sceneCanvasRef,
}: {
  sceneCanvasRef: RefObject<HTMLCanvasElement | null>;
}) => {
  const fontFamily: any = "Arial";

  const fontFamilies = [
    {
      label: "Arial",
      value: "Arial",
      icon: <Pencil className="w-4 h-4" />,
    },
    {
      label: "Helvetica",
      value: "Helvetica",
      icon: <CaseUpper className="w-4 h-4" />,
    },
    {
      label: "Sans-Serif",
      value: "sans-serif",
      icon: <Code className="w-4 h-4" />,
    },
  ];

  return (
    <div className="flex items-center gap-2 py-1">
      {fontFamilies.map((family) => (
        <PropertyItem
          key={family.value}
          data={{ ...family, active: family.value === fontFamily }}
          onClick={() => {}}
        />
      ))}
    </div>
  );
};
