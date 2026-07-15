"use client";

import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useProjectDialogsApi } from "@/components/editor/project-dialogs-provider";

export function EditorHome() {
  const api = useProjectDialogsApi();

  return (
    <div className="flex h-full items-center justify-center px-4">
      <div className="flex flex-col items-center text-center">
        <h1 className="font-heading text-xl font-semibold text-copy-primary">
          Create a project or open an existing one
        </h1>
        <p className="mt-2 max-w-[42ch] text-sm text-copy-muted">
          Start a new architecture workspace, or choose a project from the
          sidebar.
        </p>

        <Button
          className="mt-6"
          onClick={() => api.openCreate()}
          aria-label="New Project"
        >
          <Plus className="h-4 w-4" />
          New Project
        </Button>
      </div>
    </div>
  );
}
