"use client";

import { useCallback, useEffect, useState } from "react";

export interface ShareCollaborator {
  email: string;
  displayName: string | null;
  imageUrl: string | null;
  createdAt: string;
}

interface UseShareDialogOptions {
  projectId: string | null;
  isOwner: boolean;
}

export function useShareDialog({ projectId, isOwner }: UseShareDialogOptions) {
  const [shareOpen, setShareOpen] = useState(false);
  const [collaborators, setCollaborators] = useState<ShareCollaborator[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [isInviting, setIsInviting] = useState(false);
  const [removingEmail, setRemovingEmail] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCollaborators = useCallback(async () => {
    if (!projectId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/projects/${projectId}/collaborators`);
      if (!response.ok) {
        setError("Failed to load collaborators");
        return;
      }

      const data = (await response.json()) as {
        collaborators: ShareCollaborator[];
      };
      setCollaborators(data.collaborators);
    } catch {
      setError("Failed to load collaborators");
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    if (!shareOpen || !projectId) return;
    void fetchCollaborators();
  }, [shareOpen, projectId, fetchCollaborators]);

  function openShare() {
    setInviteEmail("");
    setCopied(false);
    setError(null);
    setShareOpen(true);
  }

  function closeShare() {
    if (isInviting || removingEmail) return;
    setShareOpen(false);
  }

  async function submitInvite() {
    if (!projectId || !isOwner || isInviting) return;

    const email = inviteEmail.trim();
    if (!email) return;

    setIsInviting(true);
    setError(null);

    try {
      const response = await fetch(`/api/projects/${projectId}/collaborators`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        setError(data.error ?? "Failed to invite collaborator");
        return;
      }

      const data = (await response.json()) as {
        collaborators: ShareCollaborator[];
      };
      setCollaborators(data.collaborators);
      setInviteEmail("");
    } catch {
      setError("Failed to invite collaborator");
    } finally {
      setIsInviting(false);
    }
  }

  async function removeCollaborator(email: string) {
    if (!projectId || !isOwner || removingEmail) return;

    setRemovingEmail(email);
    setError(null);

    try {
      const response = await fetch(`/api/projects/${projectId}/collaborators`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        setError("Failed to remove collaborator");
        return;
      }

      const data = (await response.json()) as {
        collaborators: ShareCollaborator[];
      };
      setCollaborators(data.collaborators);
    } catch {
      setError("Failed to remove collaborator");
    } finally {
      setRemovingEmail(null);
    }
  }

  async function copyProjectLink() {
    if (!projectId || !isOwner) return;

    const url = `${window.location.origin}/editor/${projectId}`;

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Failed to copy link");
    }
  }

  return {
    shareOpen,
    collaborators,
    isLoading,
    inviteEmail,
    isInviting,
    removingEmail,
    copied,
    error,
    openShare,
    closeShare,
    setInviteEmail,
    submitInvite,
    removeCollaborator,
    copyProjectLink,
  };
}
