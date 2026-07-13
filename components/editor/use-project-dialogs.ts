"use client";

import { useMemo, useState } from "react";

export type Project = {
  id: string;
  name: string;
  /**
   * Owned projects show rename/delete actions in the sidebar.
   * Shared/collaborator projects hide those actions.
   */
  owned: boolean;
};

function projectNameToSlug(name: string): string {
  const normalized = name.trim().toLowerCase();
  if (!normalized) return "";

  // Convert spaces/underscores to hyphens, strip non-alphanumerics, and collapse duplicates.
  return normalized
    .replace(/[\s_]+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getNewId(): string {
  // Prefer crypto UUID in the browser; fall back deterministically during tests/SSR.
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `p_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

const initialMockProjects: Project[] = [
  { id: "p_aurora", name: "Aurora Architecture", owned: true },
  { id: "p_nebula", name: "Nebula Systems", owned: true },
  { id: "p_shared_atlas", name: "Shared Atlas Workspace", owned: false },
];

export function useProjectDialogs() {
  const [projects, setProjects] = useState<Project[]>(initialMockProjects);

  const [createOpen, setCreateOpen] = useState(false);
  const [createName, setCreateName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const [renameOpen, setRenameOpen] = useState(false);
  const [renameProjectId, setRenameProjectId] = useState<string | null>(null);
  const [renameName, setRenameName] = useState("");
  const [isRenaming, setIsRenaming] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteProjectId, setDeleteProjectId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const ownedProjects = useMemo(
    () => projects.filter((p) => p.owned),
    [projects]
  );
  const sharedProjects = useMemo(
    () => projects.filter((p) => !p.owned),
    [projects]
  );

  const renameProject = useMemo(() => {
    if (!renameProjectId) return null;
    return projects.find((p) => p.id === renameProjectId) ?? null;
  }, [projects, renameProjectId]);

  const deleteProject = useMemo(() => {
    if (!deleteProjectId) return null;
    return projects.find((p) => p.id === deleteProjectId) ?? null;
  }, [projects, deleteProjectId]);

  const createSlugPreview = useMemo(
    () => projectNameToSlug(createName),
    [createName]
  );

  function openCreate() {
    setCreateName("");
    setCreateOpen(true);
  }

  function closeCreate() {
    if (isCreating) return;
    setCreateOpen(false);
  }

  function openRename(project: Project) {
    setRenameProjectId(project.id);
    setRenameName(project.name);
    setRenameOpen(true);
  }

  function closeRename() {
    if (isRenaming) return;
    setRenameOpen(false);
  }

  function openDelete(project: Project) {
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
    if (!name) return;

    setIsCreating(true);
    try {
      // Simulated async workflow (no API calls / persistence).
      await new Promise((r) => setTimeout(r, 450));

      setProjects((prev) => [
        { id: getNewId(), name, owned: true },
        ...prev,
      ]);
      setCreateOpen(false);
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
      await new Promise((r) => setTimeout(r, 450));

      setProjects((prev) =>
        prev.map((p) => (p.id === id ? { ...p, name } : p))
      );
      setRenameOpen(false);
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
      await new Promise((r) => setTimeout(r, 450));

      setProjects((prev) => prev.filter((p) => p.id !== id));
      setDeleteOpen(false);
    } finally {
      setIsDeleting(false);
    }
  }

  return {
    // mock data
    projects,
    ownedProjects,
    sharedProjects,

    // create dialog
    createOpen,
    createName,
    createSlugPreview,
    isCreating,
    openCreate,
    closeCreate,
    setCreateName,
    submitCreate,

    // rename dialog
    renameOpen,
    renameProject,
    renameName,
    isRenaming,
    openRename,
    closeRename,
    setRenameName,
    submitRename,

    // delete dialog
    deleteOpen,
    deleteProject,
    isDeleting,
    openDelete,
    closeDelete,
    submitDelete,
  };
}

