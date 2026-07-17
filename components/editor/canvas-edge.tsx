"use client";

import { useEffect, useRef, useState } from "react";
import {
  BaseEdge,
  EdgeLabelRenderer,
  getSmoothStepPath,
  useReactFlow,
  type EdgeProps,
} from "@xyflow/react";

import {
  DEFAULT_EDGE_COLOR,
  type CanvasEdge,
  type CanvasNode,
} from "@/types/canvas";

const LABEL_HINT = "Label";
const EDGE_REST_OPACITY = 0.4;
const EDGE_ACTIVE_OPACITY = 1;

export function CanvasEdgeComponent({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style,
  markerEnd,
  selected,
  data,
}: EdgeProps<CanvasEdge>) {
  const { updateEdgeData } = useReactFlow<CanvasNode, CanvasEdge>();
  const [isEditing, setIsEditing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const label = data?.label ?? "";
  const isActive = !!selected || isHovered;
  const opacity = isActive ? EDGE_ACTIVE_OPACITY : EDGE_REST_OPACITY;

  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  useEffect(() => {
    if (!isEditing) return;
    const input = inputRef.current;
    if (!input) return;
    input.focus();
    input.select();
  }, [isEditing]);

  function startEditing(event: React.MouseEvent) {
    event.stopPropagation();
    setIsEditing(true);
  }

  function finishEditing() {
    setIsEditing(false);
  }

  function handleLabelChange(event: React.ChangeEvent<HTMLInputElement>) {
    updateEdgeData(id, { label: event.target.value });
  }

  function handleLabelKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    event.stopPropagation();
    if (event.key === "Enter" || event.key === "Escape") {
      event.preventDefault();
      finishEditing();
    }
  }

  const showHint = isActive && !label && !isEditing;
  const showBadge = !!label && !isEditing;

  return (
    <>
      <g
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onDoubleClick={startEditing}
      >
        <BaseEdge
          id={id}
          path={edgePath}
          markerEnd={markerEnd}
          interactionWidth={24}
          style={{
            ...style,
            stroke: DEFAULT_EDGE_COLOR,
            strokeWidth: 1.5,
            strokeLinecap: "round",
            opacity,
          }}
        />
      </g>
      <EdgeLabelRenderer>
        {(isEditing || showBadge || showHint) && (
          <div
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
              pointerEvents: "all",
            }}
            className="nodrag nopan"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {isEditing ? (
              <input
                ref={inputRef}
                value={label}
                placeholder={LABEL_HINT}
                onChange={handleLabelChange}
                onBlur={finishEditing}
                onKeyDown={handleLabelKeyDown}
                onMouseDown={(event) => event.stopPropagation()}
                className="canvas-edge-label-input nodrag nopan nowheel min-w-[3ch] rounded-full border border-surface-border bg-elevated px-2.5 py-0.5 text-center text-xs text-copy-primary outline-none placeholder:text-copy-faint [field-sizing:content]"
                aria-label="Edge label"
              />
            ) : showBadge ? (
              <button
                type="button"
                onDoubleClick={startEditing}
                onMouseDown={(event) => event.stopPropagation()}
                className="nodrag nopan rounded-full border border-surface-border bg-elevated px-2.5 py-0.5 text-xs text-copy-secondary"
              >
                {label}
              </button>
            ) : (
              <button
                type="button"
                onDoubleClick={startEditing}
                onMouseDown={(event) => event.stopPropagation()}
                className="nodrag nopan rounded-full px-2.5 py-0.5 text-xs text-copy-faint"
              >
                {LABEL_HINT}
              </button>
            )}
          </div>
        )}
      </EdgeLabelRenderer>
    </>
  );
}
