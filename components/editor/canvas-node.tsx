"use client";

import { useEffect, useRef, useState } from "react";
import {
  Handle,
  NodeResizer,
  Position,
  useReactFlow,
  type NodeProps,
} from "@xyflow/react";

import { NodeColorToolbar } from "@/components/editor/node-color-toolbar";
import { ShapeVisual } from "@/components/editor/shape-visual";
import { MIN_NODE_HEIGHT, MIN_NODE_WIDTH } from "@/lib/canvas-shapes";
import {
  NODE_COLORS,
  DEFAULT_NODE_COLOR,
  type CanvasNode,
  type NodeColorPair,
} from "@/types/canvas";

const LABEL_PLACEHOLDER = "Label";

const HANDLE_POSITIONS = [
  Position.Top,
  Position.Right,
  Position.Bottom,
  Position.Left,
] as const;

const resizerHandleStyle = {
  width: 8,
  height: 8,
  borderRadius: 2,
  backgroundColor: "var(--bg-elevated)",
  border: "1px solid var(--border-subtle)",
};

const resizerLineStyle = {
  borderColor: "var(--border-default)",
  borderWidth: 1,
};

function getTextColor(bgColor: string): string {
  const pair = NODE_COLORS.find((color) => color.bg === bgColor);
  return pair?.text ?? DEFAULT_NODE_COLOR.text;
}

export function CanvasNodeComponent({
  id,
  data,
  selected,
}: NodeProps<CanvasNode>) {
  const textColor = getTextColor(data.color);
  const { updateNodeData } = useReactFlow<CanvasNode>();
  const [isEditing, setIsEditing] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!isEditing) return;
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.focus();
    textarea.select();
  }, [isEditing]);

  function handleLabelChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    updateNodeData(id, { label: event.target.value });
  }

  function handleLabelKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    event.stopPropagation();
    if (event.key === "Escape") {
      event.preventDefault();
      setIsEditing(false);
    }
  }

  function handleLabelDoubleClick(event: React.MouseEvent<HTMLDivElement>) {
    event.stopPropagation();
    setIsEditing(true);
  }

  function handleColorSelect(pair: NodeColorPair) {
    updateNodeData(id, { color: pair.bg });
  }

  return (
    <div className="group relative h-full w-full">
      <NodeColorToolbar
        selected={!!selected}
        activeColor={data.color}
        onColorSelect={handleColorSelect}
      />
      <NodeResizer
        isVisible={selected}
        minWidth={MIN_NODE_WIDTH}
        minHeight={MIN_NODE_HEIGHT}
        color="var(--border-subtle)"
        handleStyle={resizerHandleStyle}
        lineStyle={resizerLineStyle}
      />
      <ShapeVisual shape={data.shape} fill={data.color} selected={selected} />
      {isEditing ? (
        <div className="absolute inset-0 flex items-center justify-center px-3 py-2">
          <textarea
            ref={textareaRef}
            value={data.label}
            placeholder={LABEL_PLACEHOLDER}
            rows={1}
            onChange={handleLabelChange}
            onBlur={() => setIsEditing(false)}
            onKeyDown={handleLabelKeyDown}
            onMouseDown={(event) => event.stopPropagation()}
            className="nodrag nopan nowheel max-h-full w-full resize-none overflow-y-auto bg-transparent text-center text-sm leading-tight outline-none placeholder:opacity-40 [field-sizing:content]"
            style={{ color: textColor }}
            aria-label="Node label"
          />
        </div>
      ) : (
        <div
          onDoubleClick={handleLabelDoubleClick}
          className="absolute inset-0 flex items-center justify-center px-3 py-2 text-center text-sm leading-tight"
          style={{ color: textColor }}
        >
          {data.label ? (
            <span className="line-clamp-3 wrap-break-word">{data.label}</span>
          ) : (
            <span className="opacity-40">{LABEL_PLACEHOLDER}</span>
          )}
        </div>
      )}
      {HANDLE_POSITIONS.map((position) => (
        <Handle
          key={position}
          id={position}
          type="source"
          position={position}
          className="canvas-node-handle"
        />
      ))}
    </div>
  );
}
