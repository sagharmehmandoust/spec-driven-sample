"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type CanvasSaveStatus = "idle" | "saving" | "saved" | "error";

interface CanvasSaveContextValue {
  status: CanvasSaveStatus;
  setStatus: (status: CanvasSaveStatus) => void;
  saveNow: (() => void) | null;
  registerSaveNow: (fn: (() => void) | null) => void;
}

const CanvasSaveContext = createContext<CanvasSaveContextValue | null>(null);

export function CanvasSaveProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<CanvasSaveStatus>("idle");
  const [saveNow, setSaveNow] = useState<(() => void) | null>(null);

  const registerSaveNow = useCallback((fn: (() => void) | null) => {
    setSaveNow(() => fn);
  }, []);

  const value = useMemo(
    () => ({
      status,
      setStatus,
      saveNow,
      registerSaveNow,
    }),
    [status, saveNow, registerSaveNow]
  );

  return (
    <CanvasSaveContext.Provider value={value}>
      {children}
    </CanvasSaveContext.Provider>
  );
}

export function useCanvasSaveStatus() {
  const context = useContext(CanvasSaveContext);
  if (!context) {
    throw new Error("useCanvasSaveStatus must be used within CanvasSaveProvider");
  }
  return context;
}

export function useOptionalCanvasSaveStatus() {
  return useContext(CanvasSaveContext);
}
