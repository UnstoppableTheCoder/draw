import { toolbarItems } from "./toolbar-config";
import { ToolbarButton } from "./toolbar-button";

export default function ToolbarItems() {
  return (
    <div>
      {toolbarItems.map((item, index) => {
        const Icon = item.icon;

        return (
          <ToolbarButton
            key={index}
            item={{ ...item, icon: <Icon className={"size-4"} /> }}
          />
        );
      })}
    </div>
  );
}
