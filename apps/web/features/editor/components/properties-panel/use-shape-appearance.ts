import { RefObject, useCallback } from "react";

import { useCanvasRenderer } from "../../context/use-renderer";
import getTextDimensions from "../../geometry/text/get-text-dimensions";
import {
  usePushHistory,
  useSelectedShapesIds,
  useSetShapes,
  useSetTextEditingState,
  useTextEditingState,
} from "../../store/editor/selectors";
import {
  useSetBackgroundColor,
  useSetFontFamily,
  useSetFontSize,
  useSetOpacity,
  useSetRoundness,
  useSetStrokeColor,
  useSetStrokeStyle,
  useSetStrokeWidth,
  useSetTextAlign,
} from "../../store/properties/selectors";
import {
  Shape,
  ShapeAppearance,
  StrokeStyle,
  TextAlign,
  TextShape,
} from "../../types";
import { useParams } from "next/navigation";
import { useEditorStore } from "../../store/editor/editor-store";
import { updateShapesApi } from "../../networking/api/shape-api";

export default function useShapeAppearance(
  canvasRef: RefObject<HTMLCanvasElement | null>,
) {
  const { pageId } = useParams<{ pageId: string }>();

  const selectedShapesIds = useSelectedShapesIds();
  const setShapes = useSetShapes();

  const textEditingState = useTextEditingState();
  const setTextEditingState = useSetTextEditingState();

  const setPropertyStrokeColor = useSetStrokeColor();
  const setPropertyBackgroundColor = useSetBackgroundColor();
  const setPropertyStrokeWidth = useSetStrokeWidth();
  const setPropertyStrokeStyle = useSetStrokeStyle();
  const setPropertyFontSize = useSetFontSize();
  const setPropertyRoundness = useSetRoundness();
  const setPropertyOpacity = useSetOpacity();
  const setPropertyTextAlign = useSetTextAlign();
  const setPropertyFontFamily = useSetFontFamily();

  const { invalidate } = useCanvasRenderer();
  const pushHistory = usePushHistory();

  const updateSelectedShapes = useCallback(
    async ({
      appearance,
      data,
    }: {
      appearance?: Partial<ShapeAppearance>;
      data?: Partial<TextShape["data"]>;
    }) => {
      const ctx = canvasRef.current?.getContext("2d");
      if (!ctx) return;

      if (selectedShapesIds.length === 0) return;

      const currentShapes = useEditorStore.getState().shapes;
      const selected = new Set(selectedShapesIds);

      const updatedShapes: Shape[] = [];
      const changedShapes: Shape[] = [];

      for (const shape of currentShapes) {
        if (!selected.has(shape.id)) {
          updatedShapes.push(shape);
          continue;
        }

        let updatedShape: Shape;

        if (shape.type === "text") {
          const updatedData = data
            ? {
                ...shape.data,
                ...data,
              }
            : shape.data;

          const dimensions = getTextDimensions({
            ctx,
            text: updatedData.text,
            fontSize: updatedData.fontSize,
            fontFamily: updatedData.fontFamily,
          });

          updatedShape = {
            ...shape,
            appearance: appearance
              ? {
                  ...shape.appearance,
                  ...appearance,
                }
              : shape.appearance,
            data: updatedData,
            ...dimensions,
          };
        } else {
          updatedShape = {
            ...shape,
            appearance: appearance
              ? {
                  ...shape.appearance,
                  ...appearance,
                }
              : shape.appearance,
          };
        }

        updatedShapes.push(updatedShape);
        changedShapes.push(updatedShape);
      }

      setShapes(updatedShapes);
      pushHistory();
      invalidate();

      try {
        await updateShapesApi(pageId, changedShapes);
      } catch (error) {
        console.error(error);

        // Optional rollback
        // setShapes(currentShapes);
      }
    },
    [canvasRef, invalidate, pageId, pushHistory, selectedShapesIds, setShapes],
  );

  function setStrokeColor(strokeColor: string) {
    setPropertyStrokeColor(strokeColor);

    if (textEditingState) {
      setTextEditingState((prev) =>
        prev
          ? {
              ...prev,
              appearance: {
                ...prev.appearance,
                strokeColor,
              },
            }
          : null,
      );
    }

    updateSelectedShapes({
      appearance: { strokeColor },
    });
  }

  function setBackgroundColor(backgroundColor: string) {
    setPropertyBackgroundColor(backgroundColor);

    updateSelectedShapes({
      appearance: { backgroundColor },
    });
  }

  function setStrokeWidth(strokeWidth: number) {
    setPropertyStrokeWidth(strokeWidth);

    updateSelectedShapes({
      appearance: { strokeWidth },
    });
  }

  function setStrokeStyle(strokeStyle: StrokeStyle) {
    setPropertyStrokeStyle(strokeStyle);

    updateSelectedShapes({
      appearance: { strokeStyle },
    });
  }

  function setFontSize(fontSize: number) {
    setPropertyFontSize(fontSize);

    if (textEditingState) {
      setTextEditingState((prev) =>
        prev
          ? {
              ...prev,
              data: {
                ...prev.data,
                fontSize,
              },
            }
          : null,
      );
    }

    updateSelectedShapes({
      data: { fontSize },
    });
  }

  function setRoundness(roundness: number) {
    setPropertyRoundness(roundness);

    updateSelectedShapes({
      appearance: { roundness },
    });
  }

  function setOpacity(opacity: number) {
    setPropertyOpacity(opacity);

    updateSelectedShapes({
      appearance: { opacity },
    });
  }

  function setTextAlign(textAlign: TextAlign) {
    setPropertyTextAlign(textAlign);

    if (textEditingState) {
      setTextEditingState((prev) =>
        prev
          ? {
              ...prev,
              data: {
                ...prev.data,
                textAlign,
              },
            }
          : null,
      );
    }

    updateSelectedShapes({
      data: { textAlign },
    });
  }

  function setFontFamily(fontFamily: string) {
    setPropertyFontFamily(fontFamily);

    if (textEditingState) {
      setTextEditingState((prev) =>
        prev
          ? {
              ...prev,
              data: {
                ...prev.data,
                fontFamily,
              },
            }
          : null,
      );
    }

    updateSelectedShapes({
      data: { fontFamily },
    });
  }

  return {
    setStrokeColor,
    setBackgroundColor,
    setStrokeWidth,
    setStrokeStyle,
    setFontSize,
    setRoundness,
    setOpacity,
    setTextAlign,
    setFontFamily,
  };
}
