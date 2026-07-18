"use client";

import { useCallback, useEffect, useRef } from "react";

import {
  useCanvasSaveStatus,
  type CanvasSaveStatus,
} from "@/components/editor/canvas-save-context";
import type { CanvasEdge, CanvasNode } from "@/types/canvas";

const AUTOSAVE_DEBOUNCE_MS = 1500;

interface UseCanvasAutosaveOptions {
  projectId: string;
  nodes: CanvasNode[];
  edges: CanvasEdge[];
  enabled: boolean;
}

export function useCanvasAutosave({
  projectId,
  nodes,
  edges,
  enabled,
}: UseCanvasAutosaveOptions) {
  const { setStatus, registerSaveNow } = useCanvasSaveStatus();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSavedJsonRef = useRef<string | null>(null);
  const inFlightRef = useRef(false);
  const pendingRef = useRef(false);
  const snapshotRef = useRef({ nodes, edges });

  snapshotRef.current = { nodes, edges };

  useEffect(() => {
    lastSavedJsonRef.current = null;
    setStatus("idle");
  }, [projectId, setStatus]);

  const persist = useCallback(
    async (statusOnStart: CanvasSaveStatus = "saving") => {
      const snapshot = snapshotRef.current;
      const payload = JSON.stringify({
        nodes: snapshot.nodes,
        edges: snapshot.edges,
      });

      if (payload === lastSavedJsonRef.current) {
        setStatus("saved");
        return;
      }

      if (inFlightRef.current) {
        pendingRef.current = true;
        return;
      }

      inFlightRef.current = true;
      setStatus(statusOnStart);

      try {
        const response = await fetch(`/api/projects/${projectId}/canvas`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: payload,
        });

        if (!response.ok) {
          setStatus("error");
          return;
        }

        lastSavedJsonRef.current = payload;
        setStatus("saved");
      } catch {
        setStatus("error");
      } finally {
        inFlightRef.current = false;
        if (pendingRef.current) {
          pendingRef.current = false;
          void persist();
        }
      }
    },
    [projectId, setStatus]
  );

  const saveNow = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    void persist("saving");
  }, [persist]);

  useEffect(() => {
    registerSaveNow(enabled ? saveNow : null);
    return () => registerSaveNow(null);
  }, [enabled, registerSaveNow, saveNow]);

  useEffect(() => {
    if (!enabled) return;
    // Seed baseline after hydration so the restored snapshot does not re-save.
    if (lastSavedJsonRef.current === null) {
      lastSavedJsonRef.current = JSON.stringify({ nodes, edges });
    }
  }, [enabled, nodes, edges]);

  useEffect(() => {
    if (!enabled) return;

    const payload = JSON.stringify({ nodes, edges });
    if (payload === lastSavedJsonRef.current) return;

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      void persist();
    }, AUTOSAVE_DEBOUNCE_MS);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [enabled, nodes, edges, persist]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);
}
