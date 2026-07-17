import { MarkerType } from "@xyflow/react";

import { SHAPE_DEFAULT_SIZES } from "@/lib/canvas-shapes";
import {
  DEFAULT_EDGE_COLOR,
  NODE_COLORS,
  type CanvasEdge,
  type CanvasNode,
  type NodeShape,
} from "@/types/canvas";

export interface CanvasTemplate {
  id: string;
  name: string;
  description: string;
  nodes: CanvasNode[];
  edges: CanvasEdge[];
}

type ColorIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

function templateNode(
  id: string,
  label: string,
  shape: NodeShape,
  colorIndex: ColorIndex,
  x: number,
  y: number,
): CanvasNode {
  const size = SHAPE_DEFAULT_SIZES[shape];

  return {
    id,
    type: "canvasNode",
    position: { x, y },
    width: size.width,
    height: size.height,
    data: {
      label,
      color: NODE_COLORS[colorIndex].bg,
      shape,
    },
  };
}

function templateEdge(
  id: string,
  source: string,
  target: string,
  label?: string,
): CanvasEdge {
  return {
    id,
    type: "canvasEdge",
    source,
    target,
    style: {
      stroke: DEFAULT_EDGE_COLOR,
      strokeWidth: 1.5,
      strokeLinecap: "round",
    },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: DEFAULT_EDGE_COLOR,
      width: 16,
      height: 16,
    },
    data: label ? { label } : {},
  };
}

const microservices: CanvasTemplate = {
  id: "microservices",
  name: "Microservices",
  description:
    "API gateway, core services, shared database, and an external client.",
  nodes: [
    templateNode("ms-client", "Client", "hexagon", 1, 280, 0),
    templateNode("ms-gateway", "API Gateway", "pill", 7, 260, 140),
    templateNode("ms-users", "User Service", "rectangle", 2, 40, 300),
    templateNode("ms-orders", "Order Service", "rectangle", 3, 260, 300),
    templateNode("ms-payments", "Payment Service", "rectangle", 4, 480, 300),
    templateNode("ms-db", "Primary DB", "cylinder", 6, 280, 460),
  ],
  edges: [
    templateEdge("ms-e1", "ms-client", "ms-gateway", "HTTPS"),
    templateEdge("ms-e2", "ms-gateway", "ms-users"),
    templateEdge("ms-e3", "ms-gateway", "ms-orders"),
    templateEdge("ms-e4", "ms-gateway", "ms-payments"),
    templateEdge("ms-e5", "ms-users", "ms-db"),
    templateEdge("ms-e6", "ms-orders", "ms-db"),
    templateEdge("ms-e7", "ms-payments", "ms-db"),
  ],
};

const cicdPipeline: CanvasTemplate = {
  id: "cicd-pipeline",
  name: "CI/CD Pipeline",
  description:
    "Source control through build, test, staging, and production deploy.",
  nodes: [
    templateNode("ci-repo", "Git Repo", "cylinder", 1, 40, 120),
    templateNode("ci-build", "Build", "pill", 2, 240, 40),
    templateNode("ci-test", "Test", "diamond", 3, 240, 200),
    templateNode("ci-staging", "Staging", "rectangle", 7, 440, 40),
    templateNode("ci-prod", "Production", "rectangle", 6, 440, 200),
    templateNode("ci-notify", "Notify", "circle", 5, 640, 120),
  ],
  edges: [
    templateEdge("ci-e1", "ci-repo", "ci-build", "push"),
    templateEdge("ci-e2", "ci-repo", "ci-test"),
    templateEdge("ci-e3", "ci-build", "ci-staging"),
    templateEdge("ci-e4", "ci-test", "ci-prod", "pass"),
    templateEdge("ci-e5", "ci-staging", "ci-notify"),
    templateEdge("ci-e6", "ci-prod", "ci-notify", "deploy"),
  ],
};

const eventDriven: CanvasTemplate = {
  id: "event-driven",
  name: "Event-Driven System",
  description:
    "Producers publish events to a broker; consumers react independently.",
  nodes: [
    templateNode("ed-producer-a", "Order Service", "rectangle", 3, 40, 40),
    templateNode("ed-producer-b", "Billing Service", "rectangle", 4, 40, 220),
    templateNode("ed-broker", "Event Bus", "hexagon", 2, 280, 120),
    templateNode("ed-consumer-a", "Inventory", "pill", 7, 520, 40),
    templateNode("ed-consumer-b", "Analytics", "pill", 1, 520, 160),
    templateNode("ed-consumer-c", "Notifications", "pill", 5, 520, 280),
    templateNode("ed-store", "Event Store", "cylinder", 6, 280, 300),
  ],
  edges: [
    templateEdge("ed-e1", "ed-producer-a", "ed-broker", "publish"),
    templateEdge("ed-e2", "ed-producer-b", "ed-broker", "publish"),
    templateEdge("ed-e3", "ed-broker", "ed-consumer-a", "subscribe"),
    templateEdge("ed-e4", "ed-broker", "ed-consumer-b", "subscribe"),
    templateEdge("ed-e5", "ed-broker", "ed-consumer-c", "subscribe"),
    templateEdge("ed-e6", "ed-broker", "ed-store", "persist"),
  ],
};

export const CANVAS_TEMPLATES: CanvasTemplate[] = [
  microservices,
  cicdPipeline,
  eventDriven,
];
