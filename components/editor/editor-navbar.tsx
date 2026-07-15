"use client";

import { UserButton } from "@clerk/nextjs";
import {
  Bot,
  PanelLeftClose,
  PanelLeftOpen,
  Share2,
} from "lucide-react";

import { Button } from "@/components/ui/button";

interface EditorNavbarProps {
  isSidebarOpen: boolean;
  onSidebarToggle: () => void;
  projectName?: string;
  isAiSidebarOpen?: boolean;
  onAiSidebarToggle?: () => void;
  onShareClick?: () => void;
}

export function EditorNavbar({
  isSidebarOpen,
  onSidebarToggle,
  projectName,
  isAiSidebarOpen = false,
  onAiSidebarToggle,
  onShareClick,
}: EditorNavbarProps) {
  const isWorkspace = Boolean(projectName);

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
        <UserButton />
      </div>
    </header>
  );
}
