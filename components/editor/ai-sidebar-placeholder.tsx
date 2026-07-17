"use client";

import { Bot, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AiSidebarPlaceholderProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AiSidebarPlaceholder({
  isOpen,
  onClose,
}: AiSidebarPlaceholderProps) {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          "fixed bottom-3 right-3 top-15 z-50 flex w-80 flex-col overflow-hidden rounded-2xl border border-surface-border bg-surface/95 shadow-lg backdrop-blur-sm transition-[transform,opacity,visibility] duration-300 ease-in-out",
          isOpen
            ? "visible translate-x-0 opacity-100"
            : "invisible translate-x-[calc(100%+0.75rem)] opacity-0 pointer-events-none"
        )}
      >
        <div className="flex items-center justify-between border-b border-surface-border px-4 py-3">
          <div className="flex items-center gap-2">
            <Bot className="h-4 w-4 text-accent-ai-text" aria-hidden="true" />
            <h2 className="text-sm font-medium text-copy-primary">AI Workspace</h2>
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onClose}
            aria-label="Close AI sidebar"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex flex-1 items-center justify-center px-4 py-12 text-center">
          <p className="text-sm text-copy-muted">
            AI chat will appear here.
          </p>
        </div>
      </aside>
    </>
  );
}
