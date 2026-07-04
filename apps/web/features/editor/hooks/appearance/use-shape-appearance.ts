import {
  useSetBackgroundColor,
  useSetFontSize,
  useSetOpacity,
  useSetRoundness,
  useSetStrokeColor,
  useSetStrokeStyle,
  useSetStrokeWidth,
} from "../../store/properties/selectors";
import { useCanvasRenderer } from "../../context/use-renderer";
import { StrokeStyle } from "../../types/types";
import { RefObject, useCallback } from "react";
import {
  useSelectedShapesIds,
  useSetShapes,
  useSetTextEditingState,
  useTextEditingState,
} from "../../store/editor/selectors";
import getTextDimensions from "../../utils/get-text-dimensions";

export default function useShapeAppearance(
  canvasRef: RefObject<HTMLCanvasElement | null>,
) {
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

  const { invalidate } = useCanvasRenderer();

  const updateSelectedShapes = useCallback(
    (updates: any) => {
      if (!canvasRef) return;
      const ctx = canvasRef.current?.getContext("2d");

      if (selectedShapesIds.length === 0) return;

      const selected = new Set(selectedShapesIds);

      setShapes((prevShapes) =>
        prevShapes.map((shape) =>
          selected.has(shape.id)
            ? shape.type === "text"
              ? updates.hasOwnProperty("fontSize")
                ? {
                    ...shape,
                    ...getTextDimensions({ ctx, ...shape, ...updates }),
                    ...updates,
                  }
                : { ...shape, ...updates }
              : { ...shape, ...updates }
            : shape,
        ),
      );

      invalidate();
    },
    [selectedShapesIds, setShapes, invalidate, canvasRef, getTextDimensions],
  );

  function setStrokeColor(strokeColor: string) {
    setPropertyStrokeColor(strokeColor);
    updateSelectedShapes({ strokeColor });

    if (textEditingState) {
      setTextEditingState((prev) => {
        if (!prev) return prev;

        return { ...prev, strokeColor };
      });
    }
  }

  function setBackgroundColor(backgroundColor: string) {
    setPropertyBackgroundColor(backgroundColor);
    updateSelectedShapes({ backgroundColor });
  }

  function setStrokeWidth(strokeWidth: number) {
    setPropertyStrokeWidth(strokeWidth);
    updateSelectedShapes({ strokeWidth });
  }

  function setStrokeStyle(strokeStyle: StrokeStyle) {
    setPropertyStrokeStyle(strokeStyle);
    updateSelectedShapes({ strokeStyle });
  }

  function setFontSize(fontSize: number) {
    setPropertyFontSize(fontSize);
    updateSelectedShapes({ fontSize });

    if (textEditingState) {
      setTextEditingState((prev) => {
        if (!prev) return prev;

        return { ...prev, fontSize };
      });
    }
  }

  function setRoundness(roundness: number) {
    setPropertyRoundness(roundness);
    updateSelectedShapes({ roundness });
  }

  function setOpacity(opacity: number) {
    setPropertyOpacity(opacity);
    updateSelectedShapes({ opacity });
  }

  return {
    setStrokeColor,
    setBackgroundColor,
    setStrokeWidth,
    setStrokeStyle,
    setFontSize,
    setRoundness,
    setOpacity,
  };
}
