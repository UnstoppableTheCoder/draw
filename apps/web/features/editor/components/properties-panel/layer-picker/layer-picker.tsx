import {
  ArrowDown,
  ArrowDownToLine,
  ArrowUp,
  ArrowUpToLine,
} from "lucide-react";
import { PropertiesPanelItemWrapper } from "../properties-panel-item-wrapper";
import { PropertyItem } from "../property-item";
import { PropertiesDataType } from "../../types";
import useShapeOrder from "@/features/editor/hooks/order/use-shape-order";

export default function LayerPicker() {
  const order = useShapeOrder();

  const layers = [
    {
      label: "Send to back - Ctrl+Shift+[",
      value: "SEND_TO_BACK",
      icon: <ArrowDownToLine strokeWidth={1} className="w-4 h-4" />,
    },
    {
      label: "Send backward - Ctrl+[",
      value: "SEND_BACKWARD",
      icon: <ArrowDown strokeWidth={1} className="w-4 h-4" />,
    },
    {
      label: "Bring forward - Ctrl+]",
      value: "BRING_FORWARD",
      icon: <ArrowUp strokeWidth={1} className="w-4 h-4" />,
    },
    {
      label: "Bring to Front - Ctrl+Shift+]",
      value: "BRING_TO_FRONT",
      icon: <ArrowUpToLine strokeWidth={1} className="w-4 h-4" />,
    },
  ];

  const handleLayerChangeClick = (data: PropertiesDataType) => {
    if (data.value) {
      switch (data.value) {
        case "SEND_TO_BACK":
          order.sendToBack();
          break;

        case "SEND_BACKWARD":
          order.sendBackward();
          break;

        case "BRING_FORWARD":
          order.bringForward();
          break;

        case "BRING_TO_FRONT":
          order.bringToFront();
          break;
      }
    }
  };

  return (
    <PropertiesPanelItemWrapper title="Layers">
      <div className="flex items-center gap-2 py-1">
        {layers.map((layer, index) => (
          <PropertyItem
            key={index}
            data={{ ...layer, active: false }}
            onClick={handleLayerChangeClick}
          />
        ))}
      </div>
    </PropertiesPanelItemWrapper>
  );
}
