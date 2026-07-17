"use client";

import {
  Circle,
  Cylinder,
  Diamond,
  Hexagon,
  Pill,
  Square,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import {
  setShapeDragPayload,
  SHAPE_DEFAULT_SIZES,
  type ShapeDragPayload,
} from "@/lib/canvas-shapes";
import { NODE_SHAPES, type NodeShape } from "@/types/canvas";

const SHAPE_ICONS: Record<NodeShape, LucideIcon> = {
  rectangle: Square,
  diamond: Diamond,
  circle: Circle,
  pill: Pill,
  cylinder: Cylinder,
  hexagon: Hexagon,
};

function handleDragStart(event: React.DragEvent, shape: NodeShape) {
  const { width, height } = SHAPE_DEFAULT_SIZES[shape];
  const payload: ShapeDragPayload = { shape, width, height };

  setShapeDragPayload(event.dataTransfer, payload);
  event.dataTransfer.effectAllowed = "move";
}

export function ShapePanel() {
  return (
    <div
      className="pointer-events-none absolute inset-x-0 bottom-4 z-40 flex justify-center"
      aria-label="Shape palette"
    >
      <div className="pointer-events-auto flex items-center gap-1 rounded-full border border-surface-border bg-surface/95 px-2 py-1.5 shadow-lg backdrop-blur-sm">
        {NODE_SHAPES.map((shape) => {
          const Icon = SHAPE_ICONS[shape];

          return (
            <div
              key={shape}
              role="button"
              tabIndex={0}
              draggable
              aria-label={`Drag ${shape}`}
              onDragStart={(event) => handleDragStart(event, shape)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                }
              }}
              className="flex h-9 w-9 cursor-grab items-center justify-center rounded-full text-copy-muted transition-colors hover:bg-subtle hover:text-copy-primary active:cursor-grabbing"
            >
              <Icon className="h-5 w-5" strokeWidth={1.75} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
