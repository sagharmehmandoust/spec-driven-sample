"use client";

import { useEffect, useRef } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useProjectActions } from "@/hooks/use-project-actions";

type ProjectDialogsProps = {
  api: ReturnType<typeof useProjectActions>;
};

const projectDialogContentClass =
  "gap-0 rounded-3xl border border-surface-border bg-elevated p-6 shadow-2xl ring-0 sm:max-w-md";

const projectDialogTitleClass = "text-lg font-semibold text-copy-primary";

const projectDialogDescriptionClass = "text-sm text-copy-muted";

const projectDialogFooterClass =
  "mt-6 flex flex-row justify-end gap-3 border-0 bg-transparent p-0 -mx-0 -mb-0";

const projectDialogInputClass =
  "h-11 rounded-full border-2 border-surface-border bg-base px-5 text-sm text-copy-primary shadow-none placeholder:text-copy-muted focus-visible:border-brand focus-visible:ring-0";

const projectDialogPrimaryButtonClass =
  "h-10 rounded-full bg-brand px-6 text-sm font-medium text-primary-foreground hover:bg-brand/90";

const projectDialogSecondaryButtonClass =
  "h-10 rounded-full border border-surface-border bg-base px-6 text-sm font-medium text-copy-primary hover:bg-surface";

export function ProjectDialogs({ api }: ProjectDialogsProps) {
  const renameInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!api.renameOpen) return;
    renameInputRef.current?.focus();
    const el = renameInputRef.current;
    if (!el) return;
    const len = el.value.length;
    el.setSelectionRange(len, len);
  }, [api.renameOpen]);

  return (
    <>
      {/* Create Project */}
      <Dialog
        open={api.createOpen}
        onOpenChange={(open) => !open && api.closeCreate()}
      >
        <DialogContent className={projectDialogContentClass}>
          <DialogHeader className="gap-1.5">
            <DialogTitle className={projectDialogTitleClass}>
              Create Project
            </DialogTitle>
          </DialogHeader>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              void api.submitCreate();
            }}
            className="mt-5 flex flex-col gap-4"
          >
            <Input
              value={api.createName}
              onChange={(e) => api.setCreateName(e.target.value)}
              autoComplete="off"
              placeholder="Project name"
              className={projectDialogInputClass}
            />

            <p className="text-xs text-copy-muted">
              Room ID preview:{" "}
              <span className="text-copy-primary">
                {api.createRoomIdPreview || "—"}
              </span>
            </p>

            <DialogFooter className={projectDialogFooterClass}>
              <Button
                type="submit"
                disabled={api.isCreating || !api.createName.trim()}
                className={projectDialogPrimaryButtonClass}
              >
                {api.isCreating ? "Creating..." : "Create"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => api.closeCreate()}
                disabled={api.isCreating}
                className={projectDialogSecondaryButtonClass}
              >
                Close
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
        <DialogContent className={projectDialogContentClass}>
          <DialogHeader className="gap-1.5">
            <DialogTitle className={projectDialogTitleClass}>
              Rename Project
            </DialogTitle>
            <DialogDescription className={projectDialogDescriptionClass}>
              Renaming &ldquo;{api.renameProject?.name}&rdquo;
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              void api.submitRename();
            }}
            className="mt-5 flex flex-col gap-4"
          >
            <Input
              ref={renameInputRef}
              value={api.renameName}
              onChange={(e) => api.setRenameName(e.target.value)}
              autoComplete="off"
              placeholder="Project name"
              className={projectDialogInputClass}
            />

            <DialogFooter className={projectDialogFooterClass}>
              <Button
                type="submit"
                disabled={api.isRenaming || !api.renameName.trim()}
                className={projectDialogPrimaryButtonClass}
              >
                {api.isRenaming ? "Saving..." : "Save"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => api.closeRename()}
                disabled={api.isRenaming}
                className={projectDialogSecondaryButtonClass}
              >
                Close
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
        <DialogContent className={projectDialogContentClass}>
          <DialogHeader className="gap-1.5">
            <DialogTitle className={projectDialogTitleClass}>
              Delete Project
            </DialogTitle>
            <DialogDescription className={projectDialogDescriptionClass}>
              Deleting &ldquo;{api.deleteProject?.name}&rdquo;
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className={projectDialogFooterClass}>
            <Button
              type="button"
              onClick={() => void api.submitDelete()}
              disabled={api.isDeleting}
              className="h-10 rounded-full bg-state-error px-6 text-sm font-medium text-base hover:bg-state-error/90"
            >
              {api.isDeleting ? "Deleting..." : "Delete"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => api.closeDelete()}
              disabled={api.isDeleting}
              className={projectDialogSecondaryButtonClass}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
