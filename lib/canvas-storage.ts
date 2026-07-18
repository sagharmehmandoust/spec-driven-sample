import { get, put } from "@vercel/blob";

import type { CanvasEdge, CanvasNode } from "@/types/canvas";

export interface CanvasSnapshot {
  nodes: CanvasNode[];
  edges: CanvasEdge[];
}

function canvasPathname(projectId: string) {
  return `canvas/${projectId}.json`;
}

export async function saveCanvasSnapshot(
  projectId: string,
  snapshot: CanvasSnapshot
): Promise<string> {
  const blob = await put(canvasPathname(projectId), JSON.stringify(snapshot), {
    access: "private",
    contentType: "application/json",
    allowOverwrite: true,
    cacheControlMaxAge: 60,
  });

  return blob.url;
}

export async function loadCanvasSnapshot(
  canvasJsonPath: string
): Promise<CanvasSnapshot | null> {
  const result = await get(canvasJsonPath, {
    access: "private",
    useCache: false,
  });

  if (!result || result.statusCode === 304 || !result.stream) {
    return null;
  }

  const text = await new Response(result.stream).text();
  const parsed = JSON.parse(text) as unknown;

  if (!isCanvasSnapshot(parsed)) {
    return null;
  }

  return parsed;
}

export function isCanvasSnapshot(value: unknown): value is CanvasSnapshot {
  if (!value || typeof value !== "object") return false;

  const record = value as Record<string, unknown>;
  return Array.isArray(record.nodes) && Array.isArray(record.edges);
}
