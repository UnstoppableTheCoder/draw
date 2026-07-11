import { EditorRefs } from "@/types";
import useInteractionManager from "../../interactions/manager/use-interaction-manager";

type CanvasLayersProps = {
  editor: Pick<
    EditorRefs,
    "backgroundCanvasRef" | "sceneCanvasRef" | "overlayCanvasRef"
  >;
  interaction: ReturnType<typeof useInteractionManager>;
  onContextMenu: React.MouseEventHandler<HTMLCanvasElement>;
};

export default function CanvasLayers({
  editor,
  interaction,
  onContextMenu,
}: CanvasLayersProps) {
  const { backgroundCanvasRef, sceneCanvasRef, overlayCanvasRef } = editor;

  return (
    <>
      <canvas
        ref={backgroundCanvasRef}
        className="absolute inset-0 h-full w-full"
        style={{ zIndex: 0 }}
      />

      <canvas
        ref={sceneCanvasRef}
        className="absolute inset-0 h-full w-full"
        style={{ zIndex: 1 }}
      />

      <canvas
        ref={overlayCanvasRef}
        className="absolute inset-0 h-full w-full"
        style={{ zIndex: 2 }}
        onPointerDown={interaction.handlePointerDown}
        onPointerMove={interaction.handlePointerMove}
        onPointerUp={interaction.handlePointerUp}
        onDoubleClick={interaction.handleDoubleClick}
        onContextMenu={onContextMenu}
      />
    </>
  );
}
