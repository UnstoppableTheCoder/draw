import { RefObject, useState } from "react";
import { Slider } from "../ui/slider";

export default function PropertyRangeSlider({
  maxRange,
  value,
  onChange,
}: {
  maxRange: number;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="flex flex-col items-center gap-2 pt-3">
      <Slider
        min={0}
        max={maxRange}
        step={2}
        value={[value]}
        onValueChange={([value]) => onChange(value!)}
        className="cursor-pointer"
      />

      <div className="flex justify-between w-full text-sm text-gray-400">
        <span>0</span>
        <span>{value}</span>
      </div>
    </div>
  );
}
