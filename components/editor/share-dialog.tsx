"use client";

import { useEffect, useState } from "react";
import { Check, Copy, Loader2, UserMinus, X } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

import type { useShareDialog } from "@/hooks/use-share-dialog";

type ShareDialogProps = {
  api: ReturnType<typeof useShareDialog>;
  isOwner: boolean;
  projectId: string | null;
};

const shareDialogContentClass =
  "gap-0 rounded-3xl border border-surface-border bg-elevated p-6 shadow-2xl ring-0 sm:max-w-md";

const shareDialogTitleClass = "text-lg font-semibold text-copy-primary";

const shareDialogDescriptionClass = "text-sm text-copy-muted";

const shareDialogInputClass =
  "h-11 rounded-full border-2 border-surface-border bg-base px-5 text-sm text-copy-primary shadow-none placeholder:text-copy-muted focus-visible:border-brand focus-visible:ring-0";

const shareDialogPrimaryButtonClass =
  "h-10 shrink-0 rounded-full bg-brand px-6 text-sm font-medium text-primary-foreground hover:bg-brand/90";

function CollaboratorAvatar({
  displayName,
  email,
  imageUrl,
}: {
  displayName: string | null;
  email: string;
  imageUrl: string | null;
}) {
  const label = displayName ?? email;
  const initial = label.charAt(0).toUpperCase();

  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt=""
        className="h-9 w-9 shrink-0 rounded-full border border-surface-border object-cover"
      />
    );
  }

  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-surface-border bg-surface text-sm font-medium text-copy-primary">
      {initial}
    </div>
  );
}

export function ShareDialog({ api, isOwner, projectId }: ShareDialogProps) {
  const [projectUrl, setProjectUrl] = useState("");

  useEffect(() => {
    if (!projectId) {
      setProjectUrl("");
      return;
    }

    setProjectUrl(`${window.location.origin}/editor/${projectId}`);
  }, [projectId]);

  return (
    <Dialog open={api.shareOpen} onOpenChange={(open) => !open && api.closeShare()}>
      <DialogContent className={shareDialogContentClass}>
        <DialogHeader className="gap-1.5">
          <DialogTitle className={shareDialogTitleClass}>
            Share project
          </DialogTitle>
          <DialogDescription className={shareDialogDescriptionClass}>
            {isOwner
              ? "Invite collaborators by email and manage access."
              : "View who has access to this project."}
          </DialogDescription>
        </DialogHeader>

        {isOwner ? (
          <form
            onSubmit={(event) => {
              event.preventDefault();
              void api.submitInvite();
            }}
            className="mt-5 flex gap-2"
          >
            <Input
              type="email"
              value={api.inviteEmail}
              onChange={(event) => api.setInviteEmail(event.target.value)}
              autoComplete="off"
              placeholder="Email address"
              className={shareDialogInputClass}
            />
            <Button
              type="submit"
              disabled={api.isInviting || !api.inviteEmail.trim()}
              className={shareDialogPrimaryButtonClass}
            >
              {api.isInviting ? "Inviting..." : "Invite"}
            </Button>
          </form>
        ) : null}

        <div className="mt-5">
          <p className="mb-3 text-xs font-medium uppercase tracking-wide text-copy-muted">
            Collaborators
          </p>

          {api.isLoading ? (
            <div className="flex items-center justify-center py-8 text-copy-muted">
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>
          ) : api.collaborators.length === 0 ? (
            <p className="py-6 text-center text-sm text-copy-muted">
              No collaborators yet.
            </p>
          ) : (
            <ScrollArea className="max-h-56">
              <ul className="flex flex-col gap-2 pr-3">
                {api.collaborators.map((collaborator) => (
                  <li
                    key={collaborator.email}
                    className="flex items-center gap-3 rounded-2xl border border-surface-border bg-base px-3 py-2"
                  >
                    <CollaboratorAvatar
                      displayName={collaborator.displayName}
                      email={collaborator.email}
                      imageUrl={collaborator.imageUrl}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-copy-primary">
                        {collaborator.displayName ?? collaborator.email}
                      </p>
                      {collaborator.displayName ? (
                        <p className="truncate text-xs text-copy-muted">
                          {collaborator.email}
                        </p>
                      ) : null}
                    </div>
                    {isOwner ? (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        onClick={() =>
                          void api.removeCollaborator(collaborator.email)
                        }
                        disabled={api.removingEmail === collaborator.email}
                        aria-label={`Remove ${collaborator.email}`}
                        className="shrink-0 text-copy-muted hover:text-state-error"
                      >
                        {api.removingEmail === collaborator.email ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <UserMinus className="h-4 w-4" />
                        )}
                      </Button>
                    ) : null}
                  </li>
                ))}
              </ul>
            </ScrollArea>
          )}
        </div>

        {isOwner && projectId ? (
          <div className="mt-5 flex items-center gap-2 rounded-2xl border border-surface-border bg-base p-2 pl-4">
            <p className="min-w-0 flex-1 truncate text-sm text-copy-muted">
              {projectUrl}
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => void api.copyProjectLink()}
              className="shrink-0 rounded-full border-surface-border bg-surface text-copy-primary hover:bg-elevated"
            >
              {api.copied ? (
                <>
                  <Check className="h-4 w-4 text-state-success" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy link
                </>
              )}
            </Button>
          </div>
        ) : null}

        {api.error ? (
          <p className="mt-4 flex items-start gap-2 text-sm text-state-error">
            <X className="mt-0.5 h-4 w-4 shrink-0" />
            {api.error}
          </p>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
