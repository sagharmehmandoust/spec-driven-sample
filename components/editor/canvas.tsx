"use client";

import { useCallback } from "react";
import {
  Background,
  BackgroundVariant,
  ConnectionMode,
  MarkerType,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
  type EdgeChange,
  type NodeChange,
} from "@xyflow/react";
import { useLiveblocksFlow } from "@liveblocks/react-flow";
import { useRedo, useUndo } from "@liveblocks/react/suspense";
import "@xyflow/react/dist/style.css";

import { CanvasControls } from "@/components/editor/canvas-controls";
import { CanvasEdgeComponent } from "@/components/editor/canvas-edge";
import { CanvasNodeComponent } from "@/components/editor/canvas-node";
import { ShapePanel } from "@/components/editor/shape-panel";
import { useStarterTemplatesDialog } from "@/components/editor/starter-templates-dialog-context";
import { StarterTemplatesModal } from "@/components/editor/starter-templates-modal";
import type { CanvasTemplate } from "@/components/editor/starter-templates";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import {
  createCanvasNodeId,
  getShapeDragPayload,
} from "@/lib/canvas-shapes";
import {
  DEFAULT_EDGE_COLOR,
  DEFAULT_NODE_COLOR,
  type CanvasEdge,
  type CanvasNode,
} from "@/types/canvas";

const nodeTypes = {
  canvasNode: CanvasNodeComponent,
};

const edgeTypes = {
  canvasEdge: CanvasEdgeComponent,
};

const defaultEdgeOptions = {
  type: "canvasEdge" as const,
  style: {
    stroke: DEFAULT_EDGE_COLOR,
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
  },
  markerEnd: {
    type: MarkerType.ArrowClosed,
    color: DEFAULT_EDGE_COLOR,
    width: 16,
    height: 16,
  },
};

function CanvasContent() {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, onDelete } =
    useLiveblocksFlow<CanvasNode, CanvasEdge>({
      suspense: true,
      nodes: { initial: [] },
      edges: { initial: [] },
    });

  const reactFlow = useReactFlow();
  const undo = useUndo();
  const redo = useRedo();
  const templatesDialog = useStarterTemplatesDialog();

  useKeyboardShortcuts({
    reactFlow,
    undo,
    redo,
  });

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const payload = getShapeDragPayload(event.dataTransfer);
      if (!payload) return;

      const position = reactFlow.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode: CanvasNode = {
        id: createCanvasNodeId(payload.shape),
        type: "canvasNode",
        position: {
          x: position.x - payload.width / 2,
          y: position.y - payload.height / 2,
        },
        width: payload.width,
        height: payload.height,
        data: {
          label: "",
          color: DEFAULT_NODE_COLOR.bg,
          shape: payload.shape,
        },
      };

      onNodesChange([{ type: "add", item: newNode }]);
    },
    [onNodesChange, reactFlow],
  );

  const onImportTemplate = useCallback(
    (template: CanvasTemplate) => {
      const removeNodes: NodeChange<CanvasNode>[] = nodes.map((node) => ({
        type: "remove",
        id: node.id,
      }));
      const removeEdges: EdgeChange<CanvasEdge>[] = edges.map((edge) => ({
        type: "remove",
        id: edge.id,
      }));

      onEdgesChange(removeEdges);
      onNodesChange(removeNodes);

      const addNodes: NodeChange<CanvasNode>[] = template.nodes.map(
        (node) => ({
          type: "add",
          item: node,
        }),
      );
      const addEdges: EdgeChange<CanvasEdge>[] = template.edges.map(
        (edge) => ({
          type: "add",
          item: edge,
        }),
      );

      onNodesChange(addNodes);
      onEdgesChange(addEdges);

      window.setTimeout(() => {
        void reactFlow.fitView({ padding: 0.2, duration: 200 });
      }, 50);
    },
    [edges, nodes, onEdgesChange, onNodesChange, reactFlow],
  );

  return (
    <div className="canvas-workspace relative h-full w-full bg-base">
      <ReactFlow
        className="h-full w-full"
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDelete={onDelete}
        onDragOver={onDragOver}
        onDrop={onDrop}
        connectionMode={ConnectionMode.Loose}
        defaultEdgeOptions={defaultEdgeOptions}
        fitView
        proOptions={{ hideAttribution: true }}
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} />
      </ReactFlow>
      <CanvasControls />
      <ShapePanel />
      <StarterTemplatesModal
        open={templatesDialog.open}
        onOpenChange={templatesDialog.setOpen}
        onImport={onImportTemplate}
      />
    </div>
  );
}

export function Canvas() {
  return (
    <ReactFlowProvider>
      <CanvasContent />
    </ReactFlowProvider>
  );
}
