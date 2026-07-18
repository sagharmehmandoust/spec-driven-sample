"use client";

import { UserButton } from "@clerk/nextjs";
import {
  Bot,
  Check,
  CloudUpload,
  LayoutTemplate,
  LoaderCircle,
  PanelLeftClose,
  PanelLeftOpen,
  Share2,
  TriangleAlert,
} from "lucide-react";

import { useOptionalCanvasSaveStatus } from "@/components/editor/canvas-save-context";
import { Button } from "@/components/ui/button";

interface EditorNavbarProps {
  isSidebarOpen: boolean;
  onSidebarToggle: () => void;
  projectName?: string;
  isAiSidebarOpen?: boolean;
  onAiSidebarToggle?: () => void;
  onShareClick?: () => void;
  onTemplatesClick?: () => void;
  /** When false, UserButton is omitted (canvas presence group owns it). Default true. */
  showUserButton?: boolean;
}

function SaveStatusLabel({
  status,
}: {
  status: "idle" | "saving" | "saved" | "error";
}) {
  if (status === "saving") {
    return (
      <>
        <LoaderCircle className="h-4 w-4 animate-spin" />
        Saving…
      </>
    );
  }

  if (status === "saved") {
    return (
      <>
        <Check className="h-4 w-4 text-state-success" />
        Saved
      </>
    );
  }

  if (status === "error") {
    return (
      <>
        <TriangleAlert className="h-4 w-4 text-state-error" />
        Error
      </>
    );
  }

  return (
    <>
      <CloudUpload className="h-4 w-4" />
      Save
    </>
  );
}

export function EditorNavbar({
  isSidebarOpen,
  onSidebarToggle,
  projectName,
  isAiSidebarOpen = false,
  onAiSidebarToggle,
  onShareClick,
  onTemplatesClick,
  showUserButton = true,
}: EditorNavbarProps) {
  const isWorkspace = Boolean(projectName);
  const canvasSave = useOptionalCanvasSaveStatus();

  return (
    <header className="flex h-12 shrink-0 items-center border-b border-surface-border bg-surface">
      <div className="flex flex-1 items-center px-3">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onSidebarToggle}
          aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          {isSidebarOpen ? (
            <PanelLeftClose className="h-5 w-5" />
          ) : (
            <PanelLeftOpen className="h-5 w-5" />
          )}
        </Button>
      </div>

      <div className="flex flex-1 items-center justify-center px-3">
        {isWorkspace ? (
          <h1 className="truncate text-sm font-medium text-copy-primary">
            {projectName}
          </h1>
        ) : null}
      </div>

      <div className="flex flex-1 items-center justify-end gap-2 px-3">
        {isWorkspace ? (
          <>
            {canvasSave ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => canvasSave.saveNow?.()}
                disabled={
                  canvasSave.status === "saving" || canvasSave.saveNow === null
                }
                aria-label="Save canvas"
              >
                <SaveStatusLabel status={canvasSave.status} />
              </Button>
            ) : null}
            <Button
              variant="outline"
              size="sm"
              onClick={onTemplatesClick}
              aria-label="Import starter template"
            >
              <LayoutTemplate className="h-4 w-4" />
              Templates
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onShareClick}
              aria-label="Share project"
            >
              <Share2 className="h-4 w-4" />
              Share
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={onAiSidebarToggle}
              aria-label={isAiSidebarOpen ? "Close AI sidebar" : "Open AI sidebar"}
            >
              <Bot className="h-5 w-5" />
            </Button>
          </>
        ) : null}
        {showUserButton ? <UserButton /> : null}
      </div>
    </header>
  );
}
