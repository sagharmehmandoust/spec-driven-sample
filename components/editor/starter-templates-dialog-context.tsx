"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

interface StarterTemplatesDialogContextValue {
  open: boolean;
  openDialog: () => void;
  closeDialog: () => void;
  setOpen: (open: boolean) => void;
}

const StarterTemplatesDialogContext =
  createContext<StarterTemplatesDialogContextValue | null>(null);

export function StarterTemplatesDialogProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  const openDialog = useCallback(() => setOpen(true), []);
  const closeDialog = useCallback(() => setOpen(false), []);

  const value = useMemo(
    () => ({ open, openDialog, closeDialog, setOpen }),
    [open, openDialog, closeDialog],
  );

  return (
    <StarterTemplatesDialogContext.Provider value={value}>
      {children}
    </StarterTemplatesDialogContext.Provider>
  );
}

export function useStarterTemplatesDialog() {
  const context = useContext(StarterTemplatesDialogContext);
  if (!context) {
    throw new Error(
      "useStarterTemplatesDialog must be used within StarterTemplatesDialogProvider",
    );
  }
  return context;
}
