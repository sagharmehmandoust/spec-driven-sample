import { cn } from "@/lib/utils";
import type { NodeShape } from "@/types/canvas";

interface ShapeVisualProps {
  shape: NodeShape;
  fill: string;
  selected?: boolean;
  className?: string;
}

export function ShapeVisual({
  shape,
  fill,
  selected = false,
  className,
}: ShapeVisualProps) {
  const stroke = selected ? "var(--text-muted)" : "var(--border-default)";
  const borderClass = selected ? "border-copy-muted" : "border-surface-border";

  switch (shape) {
    case "circle":
      return (
        <div
          className={cn(
            "h-full w-full rounded-full border",
            borderClass,
            className,
          )}
          style={{ backgroundColor: fill }}
        />
      );

    case "pill":
      return (
        <div
          className={cn(
            "h-full w-full rounded-full border",
            borderClass,
            className,
          )}
          style={{ backgroundColor: fill }}
        />
      );

    case "diamond":
      return (
        <svg
          viewBox="0 0 100 100"
          className={cn("h-full w-full", className)}
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
          className={cn("h-full w-full", className)}
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
          className={cn("h-full w-full", className)}
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
          className={cn(
            "h-full w-full rounded-xl border",
            borderClass,
            className,
          )}
          style={{ backgroundColor: fill }}
        />
      );
  }
}
