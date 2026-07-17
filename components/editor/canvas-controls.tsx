"use client";

import {
  Maximize2,
  Redo2,
  Undo2,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { useReactFlow } from "@xyflow/react";
import {
  useCanRedo,
  useCanUndo,
  useRedo,
  useUndo,
} from "@liveblocks/react/suspense";

const ZOOM_DURATION_MS = 200;

const controlButtonClassName =
  "flex h-9 w-9 items-center justify-center rounded-full text-copy-muted transition-colors hover:bg-subtle hover:text-copy-primary disabled:pointer-events-none disabled:opacity-40";

export function CanvasControls() {
  const { zoomIn, zoomOut, fitView } = useReactFlow();
  const undo = useUndo();
  const redo = useRedo();
  const canUndo = useCanUndo();
  const canRedo = useCanRedo();

  return (
    <div
      className="pointer-events-none absolute bottom-4 left-4 z-40"
      aria-label="Canvas controls"
    >
      <div className="pointer-events-auto flex items-center gap-1 rounded-full border border-surface-border bg-surface/95 px-2 py-1.5 shadow-lg backdrop-blur-sm">
        <div className="flex items-center gap-1" role="group" aria-label="Zoom">
          <button
            type="button"
            aria-label="Zoom out"
            className={controlButtonClassName}
            onClick={() => {
              void zoomOut({ duration: ZOOM_DURATION_MS });
            }}
          >
            <ZoomOut className="h-5 w-5" strokeWidth={1.75} />
          </button>
          <button
            type="button"
            aria-label="Fit view"
            className={controlButtonClassName}
            onClick={() => {
              void fitView({ duration: ZOOM_DURATION_MS });
            }}
          >
            <Maximize2 className="h-5 w-5" strokeWidth={1.75} />
          </button>
          <button
            type="button"
            aria-label="Zoom in"
            className={controlButtonClassName}
            onClick={() => {
              void zoomIn({ duration: ZOOM_DURATION_MS });
            }}
          >
            <ZoomIn className="h-5 w-5" strokeWidth={1.75} />
          </button>
        </div>

        <div
          className="mx-1 h-5 w-px shrink-0 bg-surface-border"
          aria-hidden="true"
        />

        <div
          className="flex items-center gap-1"
          role="group"
          aria-label="History"
        >
          <button
            type="button"
            aria-label="Undo"
            className={controlButtonClassName}
            disabled={!canUndo}
            onClick={() => {
              undo();
            }}
          >
            <Undo2 className="h-5 w-5" strokeWidth={1.75} />
          </button>
          <button
            type="button"
            aria-label="Redo"
            className={controlButtonClassName}
            disabled={!canRedo}
            onClick={() => {
              redo();
            }}
          >
            <Redo2 className="h-5 w-5" strokeWidth={1.75} />
          </button>
        </div>
      </div>
    </div>
  );
}
