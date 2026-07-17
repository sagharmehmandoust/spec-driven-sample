"use client";

import type { CSSProperties } from "react";
import { NodeToolbar, Position } from "@xyflow/react";

import { cn } from "@/lib/utils";
import { NODE_COLORS, type NodeColorPair } from "@/types/canvas";

interface NodeColorToolbarProps {
  selected: boolean;
  activeColor: string;
  onColorSelect: (pair: NodeColorPair) => void;
}

export function NodeColorToolbar({
  selected,
  activeColor,
  onColorSelect,
}: NodeColorToolbarProps) {
  return (
    <NodeToolbar
      isVisible={selected}
      position={Position.Top}
      offset={14}
      className="nodrag nopan"
    >
      <div
        role="toolbar"
        aria-label="Node color"
        className="nodrag nopan flex items-center gap-1 rounded-full border border-surface-border bg-surface/95 px-2 py-1.5 shadow-lg backdrop-blur-sm"
        onMouseDown={(event) => event.stopPropagation()}
      >
        {NODE_COLORS.map((pair) => {
          const isActive = activeColor === pair.bg;

          return (
            <button
              key={pair.bg}
              type="button"
              aria-label={`Apply color ${pair.text}`}
              aria-pressed={isActive}
              className={cn(
                "node-color-swatch nodrag nopan size-5 shrink-0 rounded-full border transition-[box-shadow,transform] duration-150",
                "hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand",
                isActive && "node-color-swatch--active scale-110",
              )}
              style={
                {
                  backgroundColor: pair.bg,
                  "--swatch-glow": pair.text,
                } as CSSProperties
              }
              onClick={(event) => {
                event.stopPropagation();
                onColorSelect(pair);
              }}
            />
          );
        })}
      </div>
    </NodeToolbar>
  );
}
