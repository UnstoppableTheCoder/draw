import { Copy, Link, Trash2 } from "lucide-react";
import { PropertiesPanelItemWrapper } from "../properties-panel-item-wrapper";
import { PropertyItem } from "../property-item";

export default function Actions() {
  const layers = [
    {
      label: "Duplicate - Ctrl+D",
      icon: <Copy strokeWidth={1} className="w-4 h-4" />,
    },
    {
      label: "Delete",
      icon: <Trash2 strokeWidth={1} className="w-4 h-4" />,
    },
    {
      label: "Link - Ctrl+K",
      icon: <Link strokeWidth={1} className="w-4 h-4" />,
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
