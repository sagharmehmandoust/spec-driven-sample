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
          "fixed inset-y-3 right-3 z-50 flex w-80 flex-col overflow-hidden rounded-2xl border border-surface-border bg-base/95 shadow-lg backdrop-blur-sm transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "translate-x-[calc(100%+1.5rem)]"
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
