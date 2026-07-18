"use client";

import { useEffect, useRef, useState } from "react";
import type { EdgeChange, NodeChange } from "@xyflow/react";

import type { CanvasEdge, CanvasNode } from "@/types/canvas";

interface CanvasSnapshotResponse {
  nodes: CanvasNode[];
  edges: CanvasEdge[];
}

interface UseCanvasLoadOptions {
  projectId: string;
  nodes: CanvasNode[];
  edges: CanvasEdge[];
  onNodesChange: (changes: NodeChange<CanvasNode>[]) => void;
  onEdgesChange: (changes: EdgeChange<CanvasEdge>[]) => void;
}

export function useCanvasLoad({
  projectId,
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
}: UseCanvasLoadOptions) {
  const [ready, setReady] = useState(false);
  const nodesRef = useRef(nodes);
  const edgesRef = useRef(edges);
  const onNodesChangeRef = useRef(onNodesChange);
  const onEdgesChangeRef = useRef(onEdgesChange);

  nodesRef.current = nodes;
  edgesRef.current = edges;
  onNodesChangeRef.current = onNodesChange;
  onEdgesChangeRef.current = onEdgesChange;

  useEffect(() => {
    let cancelled = false;

    async function hydrate() {
      if (nodesRef.current.length > 0 || edgesRef.current.length > 0) {
        if (!cancelled) setReady(true);
        return;
      }

      try {
        const response = await fetch(`/api/projects/${projectId}/canvas`);

        if (cancelled) return;

        if (response.status === 404) {
          setReady(true);
          return;
        }

        if (!response.ok) {
          setReady(true);
          return;
        }

        const snapshot = (await response.json()) as CanvasSnapshotResponse;

        if (cancelled) return;

        // Skip load if collaborators populated the room while we were fetching.
        if (nodesRef.current.length > 0 || edgesRef.current.length > 0) {
          setReady(true);
          return;
        }

        if (
          (!Array.isArray(snapshot.nodes) || snapshot.nodes.length === 0) &&
          (!Array.isArray(snapshot.edges) || snapshot.edges.length === 0)
        ) {
          setReady(true);
          return;
        }

        const addNodes: NodeChange<CanvasNode>[] = snapshot.nodes.map(
          (node) => ({
            type: "add",
            item: node,
          })
        );
        const addEdges: EdgeChange<CanvasEdge>[] = snapshot.edges.map(
          (edge) => ({
            type: "add",
            item: edge,
          })
        );

        if (addNodes.length > 0) {
          onNodesChangeRef.current(addNodes);
        }
        if (addEdges.length > 0) {
          onEdgesChangeRef.current(addEdges);
        }
      } catch {
        // Leave the canvas empty; autosave can still create a snapshot later.
      } finally {
        if (!cancelled) setReady(true);
      }
    }

    void hydrate();

    return () => {
      cancelled = true;
    };
  }, [projectId]);

  return ready;
}
