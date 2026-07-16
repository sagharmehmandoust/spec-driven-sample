import type { Edge, Node } from "@xyflow/react";

export const NODE_COLORS = [
  { bg: "#1F1F1F", text: "#EDEDED" },
  { bg: "#10233D", text: "#52A8FF" },
  { bg: "#2E1938", text: "#BF7AF0" },
  { bg: "#331B00", text: "#FF990A" },
  { bg: "#3C1618", text: "#FF6166" },
  { bg: "#3A1726", text: "#F75F8F" },
  { bg: "#0F2E18", text: "#62C073" },
  { bg: "#062822", text: "#0AC7B4" },
] as const;

export const DEFAULT_NODE_COLOR = NODE_COLORS[0];

export const DEFAULT_EDGE_COLOR = "#f8fafc";

export const NODE_SHAPES = [
  "rectangle",
  "diamond",
  "circle",
  "pill",
  "cylinder",
  "hexagon",
] as const;

export type NodeShape = (typeof NODE_SHAPES)[number];

export type NodeColorPair = (typeof NODE_COLORS)[number];

export interface CanvasNodeData {
  label: string;
  color: string;
  shape: NodeShape;
  [key: string]: unknown;
}

export interface CanvasEdgeData {
  label?: string;
  [key: string]: unknown;
}

export type CanvasNode = Node<CanvasNodeData, "canvasNode">;
export type CanvasEdge = Edge<CanvasEdgeData, "canvasEdge">;
