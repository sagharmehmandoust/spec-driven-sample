"use client";

import type { NodeProps } from "@xyflow/react";

import { NODE_COLORS, DEFAULT_NODE_COLOR } from "@/types/canvas";
import type { CanvasNode, NodeShape } from "@/types/canvas";

function getTextColor(bgColor: string): string {
  const pair = NODE_COLORS.find((color) => color.bg === bgColor);
  return pair?.text ?? DEFAULT_NODE_COLOR.text;
}

interface ShapeVisualProps {
  shape: NodeShape;
  fill: string;
}

function ShapeVisual({ shape, fill }: ShapeVisualProps) {
  const stroke = "var(--border-default)";

  switch (shape) {
    case "circle":
      return (
        <div
          className="h-full w-full rounded-full border border-surface-border"
          style={{ backgroundColor: fill }}
        />
      );

    case "pill":
      return (
        <div
          className="h-full w-full rounded-full border border-surface-border"
          style={{ backgroundColor: fill }}
        />
      );

    case "diamond":
      return (
        <svg
          viewBox="0 0 100 100"
          className="h-full w-full"
          aria-hidden="true"
        >
          <polygon
            points="50,4 96,50 50,96 4,50"
            fill={fill}
            stroke={stroke}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      );

    case "hexagon":
      return (
        <svg
          viewBox="0 0 100 100"
          className="h-full w-full"
          aria-hidden="true"
        >
          <polygon
            points="50,4 88,27 88,73 50,96 12,73 12,27"
            fill={fill}
            stroke={stroke}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      );

    case "cylinder":
      return (
        <svg
          viewBox="0 0 100 100"
          className="h-full w-full"
          aria-hidden="true"
        >
          <path
            d="M12 24 C12 14 88 14 88 24 V76 C88 86 12 86 12 76 Z"
            fill={fill}
            stroke={stroke}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <ellipse
            cx="50"
            cy="24"
            rx="38"
            ry="12"
            fill={fill}
            stroke={stroke}
            strokeWidth="1.5"
          />
          <path
            d="M12 76 C12 86 88 86 88 76"
            fill="none"
            stroke={stroke}
            strokeWidth="1.5"
          />
        </svg>
      );

    case "rectangle":
    default:
      return (
        <div
          className="h-full w-full rounded-xl border border-surface-border"
          style={{ backgroundColor: fill }}
        />
      );
  }
}

export function CanvasNodeComponent({ data }: NodeProps<CanvasNode>) {
  const textColor = getTextColor(data.color);

  return (
    <div className="relative h-full w-full">
      <ShapeVisual shape={data.shape} fill={data.color} />
      {data.label ? (
        <span
          className="pointer-events-none absolute inset-0 flex items-center justify-center px-3 py-2 text-center text-sm leading-tight"
          style={{ color: textColor }}
        >
          {data.label}
        </span>
      ) : null}
    </div>
  );
}
