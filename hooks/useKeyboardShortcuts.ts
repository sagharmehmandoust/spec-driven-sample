"use client";

import { useEffect } from "react";
import type { ReactFlowInstance } from "@xyflow/react";

const ZOOM_DURATION_MS = 200;

interface UseKeyboardShortcutsOptions {
  reactFlow: ReactFlowInstance;
  undo: () => void;
  redo: () => void;
}

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;

  const tagName = target.tagName;
  if (tagName === "INPUT" || tagName === "TEXTAREA" || tagName === "SELECT") {
    return true;
  }

  if (target.isContentEditable) return true;

  return target.closest('[contenteditable="true"]') !== null;
}

export function useKeyboardShortcuts({
  reactFlow,
  undo,
  redo,
}: UseKeyboardShortcutsOptions) {
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (isEditableTarget(event.target)) return;

      const isMod = event.metaKey || event.ctrlKey;
      const key = event.key.toLowerCase();

      if (event.key === "+" || event.key === "=") {
        event.preventDefault();
        void reactFlow.zoomIn({ duration: ZOOM_DURATION_MS });
        return;
      }

      if (event.key === "-") {
        event.preventDefault();
        void reactFlow.zoomOut({ duration: ZOOM_DURATION_MS });
        return;
      }

      if (isMod && key === "z" && event.shiftKey) {
        event.preventDefault();
        redo();
        return;
      }

      if (isMod && key === "z") {
        event.preventDefault();
        undo();
        return;
      }

      if (isMod && key === "y") {
        event.preventDefault();
        redo();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [reactFlow, undo, redo]);
}
