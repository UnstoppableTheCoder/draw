"use client";

import { useState } from "react";

export default function OpacitySlider() {
  const [value, setValue] = useState(70);

  return (
    <div className="w-52 rounded-md bg-[#232329] p-4 text-white">
      <p className="mb-3 text-sm text-gray-300">Opacity</p>

      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        className="slider w-full"
      />

      <div className="mt-2 flex justify-between text-sm text-gray-400">
        <span>0</span>
        <span>{value}</span>
      </div>
    </div>
  );
}
