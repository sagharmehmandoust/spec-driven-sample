"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export interface SidebarProject {
  id: string;
  name: string;
  owned: boolean;
}

export interface ProjectActionsInitialData {
  ownedProjects: Array<{ id: string; name: string }>;
  sharedProjects: Array<{ id: string; name: string }>;
}

function projectNameToSlug(name: string): string {
  const normalized = name.trim().toLowerCase();
  if (!normalized) return "";

  return normalized
    .replace(/[\s_]+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getShortSuffix(): string {
  if (typeof crypto !== "undefined" && "getRandomValues" in crypto) {
    const bytes = new Uint8Array(2);
    crypto.getRandomValues(bytes);
    return Array.from(bytes, (byte) => byte.toString(36).padStart(2, "0"))
      .join("")
      .slice(0, 4);
  }

  return Math.random().toString(36).slice(2, 6);
}

export function useProjectActions(initialData: ProjectActionsInitialData) {
  const router = useRouter();
  const pathname = usePathname();

  const ownedProjects = useMemo<SidebarProject[]>(
    () =>
      initialData.ownedProjects.map((project) => ({
        ...project,
        owned: true,
      })),
    [initialData.ownedProjects]
  );

  const sharedProjects = useMemo<SidebarProject[]>(
    () =>
      initialData.sharedProjects.map((project) => ({
        ...project,
        owned: false,
      })),
    [initialData.sharedProjects]
  );

  const allProjects = useMemo(
    () => [...ownedProjects, ...sharedProjects],
    [ownedProjects, sharedProjects]
  );

  const [createOpen, setCreateOpen] = useState(false);
  const [createName, setCreateName] = useState("");
  const [createSuffix, setCreateSuffix] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const [renameOpen, setRenameOpen] = useState(false);
  const [renameProjectId, setRenameProjectId] = useState<string | null>(null);
  const [renameName, setRenameName] = useState("");
  const [isRenaming, setIsRenaming] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteProjectId, setDeleteProjectId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const renameProject = useMemo(() => {
    if (!renameProjectId) return null;
    return allProjects.find((project) => project.id === renameProjectId) ?? null;
  }, [allProjects, renameProjectId]);

  const deleteProject = useMemo(() => {
    if (!deleteProjectId) return null;
    return allProjects.find((project) => project.id === deleteProjectId) ?? null;
  }, [allProjects, deleteProjectId]);

  const createRoomIdPreview = useMemo(() => {
    const slug = projectNameToSlug(createName);
    if (!slug || !createSuffix) return "";
    return `${slug}-${createSuffix}`;
  }, [createName, createSuffix]);

  function openCreate() {
    setCreateName("");
    setCreateSuffix(getShortSuffix());
    setCreateOpen(true);
  }

  function closeCreate() {
    if (isCreating) return;
    setCreateOpen(false);
  }

  function openRename(project: SidebarProject) {
    setRenameProjectId(project.id);
    setRenameName(project.name);
    setRenameOpen(true);
  }

  function closeRename() {
    if (isRenaming) return;
    setRenameOpen(false);
  }

  function openDelete(project: SidebarProject) {
    setDeleteProjectId(project.id);
    setDeleteOpen(true);
  }

  function closeDelete() {
    if (isDeleting) return;
    setDeleteOpen(false);
  }

  async function submitCreate() {
    if (isCreating) return;

    const name = createName.trim();
    const roomId = createRoomIdPreview;
    if (!name || !roomId) return;

    setIsCreating(true);
    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, id: roomId }),
      });

      if (!response.ok) return;

      const project = (await response.json()) as { id: string };
      setCreateOpen(false);
      router.push(`/editor/${project.id}`);
    } finally {
      setIsCreating(false);
    }
  }

  async function submitRename() {
    if (isRenaming) return;

    const id = renameProjectId;
    const name = renameName.trim();
    if (!id || !name) return;

    setIsRenaming(true);
    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) return;

      setRenameOpen(false);
      router.refresh();
    } finally {
      setIsRenaming(false);
    }
  }

  async function submitDelete() {
    if (isDeleting) return;

    const id = deleteProjectId;
    if (!id) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) return;

      setDeleteOpen(false);

      const activeRoomId = pathname.startsWith("/editor/")
        ? pathname.split("/")[2]
        : null;

      if (activeRoomId === id) {
        router.push("/editor");
      } else {
        router.refresh();
      }
    } finally {
      setIsDeleting(false);
    }
  }

  return {
    ownedProjects,
    sharedProjects,

    createOpen,
    createName,
    createRoomIdPreview,
    isCreating,
    openCreate,
    closeCreate,
    setCreateName,
    submitCreate,

    renameOpen,
    renameProject,
    renameName,
    isRenaming,
    openRename,
    closeRename,
    setRenameName,
    submitRename,

    deleteOpen,
    deleteProject,
    isDeleting,
    openDelete,
    closeDelete,
    submitDelete,
  };
}
