import type { NodeShape } from "@/types/canvas";

export const SHAPE_DRAG_TYPE = "application/canvas-shape";

export interface ShapeDragPayload {
  shape: NodeShape;
  width: number;
  height: number;
}

export const SHAPE_DEFAULT_SIZES: Record<
  NodeShape,
  { width: number; height: number }
> = {
  rectangle: { width: 160, height: 80 },
  diamond: { width: 140, height: 140 },
  circle: { width: 100, height: 100 },
  pill: { width: 160, height: 56 },
  cylinder: { width: 120, height: 80 },
  hexagon: { width: 120, height: 104 },
};

export const MIN_NODE_WIDTH = 40;
export const MIN_NODE_HEIGHT = 40;

let nodeIdCounter = 0;

export function createCanvasNodeId(shape: NodeShape): string {
  nodeIdCounter += 1;
  return `${shape}-${Date.now()}-${nodeIdCounter}`;
}

export function parseShapeDragPayload(data: string): ShapeDragPayload | null {
  if (!data) return null;

  try {
    const parsed = JSON.parse(data) as ShapeDragPayload;
    if (
      typeof parsed.shape !== "string" ||
      typeof parsed.width !== "number" ||
      typeof parsed.height !== "number"
    ) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function serializeShapeDragPayload(payload: ShapeDragPayload): string {
  return JSON.stringify(payload);
}

export function setShapeDragPayload(
  dataTransfer: DataTransfer,
  payload: ShapeDragPayload,
): void {
  const serialized = serializeShapeDragPayload(payload);
  dataTransfer.setData(SHAPE_DRAG_TYPE, serialized);
  dataTransfer.setData("text/plain", serialized);
}

export function getShapeDragPayload(
  dataTransfer: DataTransfer,
): ShapeDragPayload | null {
  return (
    parseShapeDragPayload(dataTransfer.getData(SHAPE_DRAG_TYPE)) ??
    parseShapeDragPayload(dataTransfer.getData("text/plain"))
  );
}
