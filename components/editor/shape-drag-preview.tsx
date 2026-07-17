"use client";

import { useEffect, useState } from "react";

import { ShapeVisual } from "@/components/editor/shape-visual";
import type { ShapeDragPayload } from "@/lib/canvas-shapes";
import { DEFAULT_NODE_COLOR } from "@/types/canvas";

export interface ShapeDragPreviewState extends ShapeDragPayload {
  x: number;
  y: number;
}

interface ShapeDragPreviewProps {
  preview: ShapeDragPreviewState | null;
}

export function ShapeDragPreview({ preview }: ShapeDragPreviewProps) {
  const [position, setPosition] = useState<{ x: number; y: number } | null>(
    null,
  );

  useEffect(() => {
    if (!preview) {
      setPosition(null);
      return;
    }

    setPosition({ x: preview.x, y: preview.y });

    const handleDragOver = (event: DragEvent) => {
      setPosition({ x: event.clientX, y: event.clientY });
    };

    const clearPreview = () => {
      setPosition(null);
    };

    document.addEventListener("dragover", handleDragOver);
    document.addEventListener("dragend", clearPreview);
    document.addEventListener("drop", clearPreview);

    return () => {
      document.removeEventListener("dragover", handleDragOver);
      document.removeEventListener("dragend", clearPreview);
      document.removeEventListener("drop", clearPreview);
    };
  }, [preview]);

  if (!preview || !position) return null;

  return (
    <div
      className="pointer-events-none fixed z-50 opacity-60"
      style={{
        left: position.x - preview.width / 2,
        top: position.y - preview.height / 2,
        width: preview.width,
        height: preview.height,
      }}
      aria-hidden="true"
    >
      <ShapeVisual shape={preview.shape} fill={DEFAULT_NODE_COLOR.bg} />
    </div>
  );
}
