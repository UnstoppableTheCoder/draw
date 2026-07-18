// features/dashboard/components/preview.tsx

import { cn } from "@/lib/utils";

export function Preview({ kind }: any) {
  return (
    <div className="canvas-grid relative h-36 overflow-hidden bg-background">
      {kind === "flow" && (
        <>
          <div className="absolute left-5 top-9 h-12 w-20 rounded-lg border bg-card" />
          <div className="absolute left-[45%] top-16 h-px w-16 bg-muted-foreground" />
          <div className="absolute right-5 top-10 h-14 w-24 rounded-lg border border-primary bg-primary/10" />
          <div className="absolute bottom-5 left-20 h-8 w-32 rounded border bg-card" />
        </>
      )}

      {kind === "notes" && (
        <div className="grid grid-cols-3 gap-3 p-5">
          <div className="h-20 rotate-[-2deg] rounded bg-primary/25 p-2 text-[8px]">
            Launch ideas
          </div>
          <div className="mt-4 h-20 rotate-2 rounded bg-secondary p-2 text-[8px]">
            What worked?
          </div>
          <div className="h-20 rotate-[-1deg] rounded bg-muted p-2 text-[8px]">
            Next steps
          </div>
        </div>
      )}

      {kind === "map" && (
        <>
          <div className="absolute left-1/2 top-12 -translate-x-1/2 rounded-lg border border-primary bg-primary/10 px-5 py-3 text-[9px]">
            Discover
          </div>

          {[
            "left-8 top-20",
            "right-8 top-20",
            "left-20 bottom-4",
            "right-20 bottom-4",
          ].map((position) => (
            <div
              key={position}
              className={cn(
                "absolute rounded border bg-card px-3 py-2 text-[8px]",
                position,
              )}
            >
              Touchpoint
            </div>
          ))}
        </>
      )}

      {kind === "wireframe" && (
        <div className="flex gap-4 p-5">
          <div className="h-24 flex-1 rounded border bg-card p-2">
            <div className="mb-2 h-2 w-1/2 rounded bg-muted" />
            <div className="h-12 rounded bg-secondary" />
          </div>

          <div className="h-24 flex-1 rounded border border-primary bg-card p-2">
            <div className="mb-2 h-2 w-2/3 rounded bg-muted" />
            <div className="grid grid-cols-2 gap-1">
              <div className="h-12 rounded bg-secondary" />
              <div className="h-12 rounded bg-secondary" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
