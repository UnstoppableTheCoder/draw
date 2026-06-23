import { useAppSelector } from "@/hooks/hooks";
import { PropertiesPanelItemWrapper } from "../properties-panel-item-wrapper";
import { FontFamilyPicker } from "./font-family-picker/font-family-picker";
import { FontSizePicker } from "./font-size-picker/font-size-picker";
import { TextAlignPicker } from "./text-align-picker/text-align-picker";
import { selectTool } from "@/features/toolbar/toolbar-slice";

export const FontTools = () => {
  const selectedTool = useAppSelector(selectTool);

  // Rendering Font Tools Conditionally
  if (selectedTool !== "text") {
    return;
  }

  const items = [
    {
      element: <FontSizePicker />,
      title: "Font size",
    },
    {
      element: <FontFamilyPicker />,
      title: "Font family",
    },
    {
      element: <TextAlignPicker />,
      title: "Text align",
    },
  ];

  return (
    <>
      {items.map((item, index) => (
        <PropertiesPanelItemWrapper key={index} title={item.title}>
          {item.element}
        </PropertiesPanelItemWrapper>
      ))}
    </>
  );
};
