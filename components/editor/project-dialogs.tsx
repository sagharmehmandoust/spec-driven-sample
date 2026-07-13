"use client";

import { useEffect, useRef } from "react";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useProjectDialogs } from "@/components/editor/use-project-dialogs";

type ProjectDialogsProps = {
  api: ReturnType<typeof useProjectDialogs>;
};

export function ProjectDialogs({ api }: ProjectDialogsProps) {
  const renameInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!api.renameOpen) return;
    renameInputRef.current?.focus();
    // Place cursor at end for fast overwrites.
    const el = renameInputRef.current;
    if (!el) return;
    const len = el.value.length;
    el.setSelectionRange(len, len);
  }, [api.renameOpen]);

  return (
    <>
      {/* Create Project */}
      <Dialog open={api.createOpen} onOpenChange={(open) => !open && api.closeCreate()}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Create Project</DialogTitle>
          </DialogHeader>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              void api.submitCreate();
            }}
            className="flex flex-col gap-3"
          >
            <div className="flex flex-col gap-1.5">
              <span className="text-sm text-copy-muted">Project name</span>
              <Input
                value={api.createName}
                onChange={(e) => api.setCreateName(e.target.value)}
                autoComplete="off"
                placeholder="e.g. Aurora Architecture"
              />
            </div>

            <div className="text-xs text-copy-muted">
              Slug preview:{" "}
              <span className="text-copy-primary">
                {api.createSlugPreview || "—"}
              </span>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => api.closeCreate()}
                disabled={api.isCreating}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={api.isCreating || !api.createName.trim()}>
                {api.isCreating ? "Creating..." : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Rename Project */}
      <Dialog
        open={api.renameOpen}
        onOpenChange={(open) => !open && api.closeRename()}
      >
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Rename Project</DialogTitle>
            <DialogDescription>
              Current project name: {api.renameProject?.name}
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              void api.submitRename();
            }}
            className="flex flex-col gap-3"
          >
            <div className="flex flex-col gap-1.5">
              <span className="text-sm text-copy-muted">Project name</span>
              <Input
                ref={renameInputRef}
                value={api.renameName}
                onChange={(e) => api.setRenameName(e.target.value)}
                autoComplete="off"
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => api.closeRename()}
                disabled={api.isRenaming}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={api.isRenaming || !api.renameName.trim()}
              >
                {api.isRenaming ? "Renaming..." : "Rename"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Project */}
      <Dialog
        open={api.deleteOpen}
        onOpenChange={(open) => !open && api.closeDelete()}
      >
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Delete Project</DialogTitle>
            <DialogDescription>
              This is a destructive confirmation only.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => api.closeDelete()}
              disabled={api.isDeleting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={() => void api.submitDelete()}
              disabled={api.isDeleting}
            >
              {api.isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

