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
import { useCanvasRenderer } from "../../context/use-renderer";
import { StrokeStyle, TextAlign } from "../../types/types";
import { RefObject, useCallback } from "react";
import {
  usePushHistory,
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
  const setPropertyTextAlign = useSetTextAlign();
  const setPropertyFontFamily = useSetFontFamily();

  const { invalidate } = useCanvasRenderer();
  const pushHistory = usePushHistory();

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
              ? updates.hasOwnProperty("fontSize") ||
                updates.hasOwnProperty("fontFamily")
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
      pushHistory();
      invalidate();
    },
    [selectedShapesIds, setShapes, invalidate, canvasRef, getTextDimensions],
  );

  function setStrokeColor(strokeColor: string) {
    setPropertyStrokeColor(strokeColor);

    if (textEditingState) {
      setTextEditingState((prev) => {
        if (!prev) return prev;

        return { ...prev, strokeColor };
      });
    }

    updateSelectedShapes({ strokeColor });
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

    if (textEditingState) {
      setTextEditingState((prev) => {
        if (!prev) return prev;

        return { ...prev, fontSize };
      });
    }

    updateSelectedShapes({ fontSize });
  }

  function setRoundness(roundness: number) {
    setPropertyRoundness(roundness);
    updateSelectedShapes({ roundness });
  }

  function setOpacity(opacity: number) {
    setPropertyOpacity(opacity);
    updateSelectedShapes({ opacity });
  }

  function setTextAlign(textAlign: TextAlign) {
    setPropertyTextAlign(textAlign);

    if (textEditingState) {
      setTextEditingState((prev) => {
        if (!prev) return prev;

        return { ...prev, textAlign };
      });
    }

    updateSelectedShapes({ textAlign });
  }

  function setFontFamily(fontFamily: string) {
    setPropertyFontFamily(fontFamily);

    if (textEditingState) {
      setTextEditingState((prev) => {
        if (!prev) return prev;

        return { ...prev, fontFamily };
      });
    }

    updateSelectedShapes({ fontFamily });
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
