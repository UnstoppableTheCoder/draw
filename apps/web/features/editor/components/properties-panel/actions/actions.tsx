import { Copy, Link, Trash2 } from "lucide-react";
import { PropertiesPanelItemWrapper } from "../properties-panel-item-wrapper";
import { PropertyItem } from "../property-item";
import { useSelectedShapesIds } from "@/features/editor/store/editor/selectors";
import { PropertiesDataType } from "../../types";
import useDeleteShapes from "@/features/editor/hooks/actions/use-delete-shapes";
import useDuplicateShapes from "@/features/editor/hooks/actions/use-duplicate-shapes";

export default function Actions() {
  const selectedShapesIds = useSelectedShapesIds();
  const { deleteShapes } = useDeleteShapes();
  const { duplicateShapes } = useDuplicateShapes();

  if (selectedShapesIds.length === 0) return;

  const layers = [
    {
      label: "Duplicate - Ctrl+D",
      value: "DUPLICATE",
      icon: <Copy strokeWidth={1} className="w-4 h-4" />,
    },
    {
      label: "Delete",
      value: "DELETE",
      icon: <Trash2 strokeWidth={1} className="w-4 h-4" />,
    },
    {
      label: "Link - Ctrl+K",
      value: "LINK",
      icon: <Link strokeWidth={1} className="w-4 h-4" />,
    },
  ];

  const handleShapeActionsClick = (data: PropertiesDataType) => {
    if (data.value) {
      switch (data.value) {
        case "DUPLICATE":
          duplicateShapes();
          break;

        case "DELETE":
          deleteShapes();
          break;

        case "LINK":
          break;

        default:
          break;
      }
    }
  };

  return (
    <PropertiesPanelItemWrapper title="Actions">
      <div className="flex items-center gap-2 py-1">
        {layers.map((layer, index) => (
          <PropertyItem
            key={index}
            data={{ ...layer, active: false }}
            onClick={handleShapeActionsClick}
          />
        ))}
      </div>
    </PropertiesPanelItemWrapper>
  );
}
