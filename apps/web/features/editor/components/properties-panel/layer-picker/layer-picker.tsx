import {
  ArrowDown,
  ArrowDownToLine,
  ArrowUp,
  ArrowUpToLine,
} from "lucide-react";
import { PropertiesPanelItemWrapper } from "../properties-panel-item-wrapper";
import { PropertyItem } from "../property-item";

export default function LayerPicker() {
  const layers = [
    {
      label: "Send to back - Ctrl+Shift+[",
      icon: <ArrowDownToLine strokeWidth={1} className="w-4 h-4" />,
    },
    {
      label: "Send backward - Ctrl+[",
      icon: <ArrowDown strokeWidth={1} className="w-4 h-4" />,
    },
    {
      label: "Bring forward - Ctrl+]",
      icon: <ArrowUp strokeWidth={1} className="w-4 h-4" />,
    },
    {
      label: "Bring to Front - Ctrl+Shift+]",
      icon: <ArrowUpToLine strokeWidth={1} className="w-4 h-4" />,
    },
  ];

  return (
    <PropertiesPanelItemWrapper title="Layers">
      <div className="flex items-center gap-2 py-1">
        {layers.map((layer, index) => (
          <PropertyItem
            key={index}
            data={{ ...layer, active: false }}
            onClick={() => {}}
          />
        ))}
      </div>
    </PropertiesPanelItemWrapper>
  );
}
