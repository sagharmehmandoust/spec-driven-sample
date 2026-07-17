"use client";

import { Pencil, Plus, Trash2, X } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useProjectDialogsApi } from "@/components/editor/project-dialogs-provider";

interface ProjectSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeRoomId?: string | null;
}

function EmptyProjectsState({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-4 py-12 text-center">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-surface-border bg-surface/50 text-copy-faint">
        <span aria-hidden="true" className="text-xs">
          ·
        </span>
      </div>
      <p className="text-sm text-copy-muted">No {label.toLowerCase()} yet</p>
    </div>
  );
}

export function ProjectSidebar({
  isOpen,
  onClose,
  activeRoomId = null,
}: ProjectSidebarProps) {
  const api = useProjectDialogsApi();

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 sm:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          "fixed bottom-3 left-3 top-15 z-50 flex w-72 flex-col overflow-hidden rounded-2xl border border-surface-border bg-surface/95 shadow-lg backdrop-blur-sm transition-[transform,opacity,visibility] duration-300 ease-in-out",
          isOpen
            ? "visible translate-x-0 opacity-100"
            : "invisible -translate-x-[calc(100%+0.75rem)] opacity-0 pointer-events-none"
        )}
      >
        <div className="flex items-center justify-between border-b border-surface-border px-4 py-3">
          <h2 className="text-sm font-medium text-copy-primary">Projects</h2>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <Tabs defaultValue="my-projects" className="flex min-h-0 flex-1 flex-col">
        <TabsList className="mx-4 mt-3 w-auto">
          <TabsTrigger value="my-projects">My Projects</TabsTrigger>
          <TabsTrigger value="shared">Shared</TabsTrigger>
        </TabsList>

        <ScrollArea className="min-h-0 flex-1">
          <TabsContent value="my-projects" className="mt-0 px-2">
            {api.ownedProjects.length === 0 ? (
              <EmptyProjectsState label="My Projects" />
            ) : (
              <div className="flex flex-col gap-1.5 py-2">
                {api.ownedProjects.map((project) => (
                  <div
                    key={project.id}
                    className={cn(
                      "group flex items-center justify-between gap-3 rounded-lg px-2 py-2 hover:bg-surface/60",
                      activeRoomId === project.id &&
                        "bg-accent-dim ring-1 ring-brand/30"
                    )}
                  >
                    <Link
                      href={`/editor/${project.id}`}
                      onClick={onClose}
                      className="min-w-0 flex-1 truncate text-sm font-medium text-copy-primary"
                    >
                      {project.name}
                    </Link>

                    {project.owned ? (
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon-xs"
                          onClick={() => api.openRename(project)}
                          aria-label={`Rename ${project.name}`}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-xs"
                          onClick={() => api.openDelete(project)}
                          aria-label={`Delete ${project.name}`}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
          <TabsContent value="shared" className="mt-0 px-2">
            {api.sharedProjects.length === 0 ? (
              <EmptyProjectsState label="Shared Projects" />
            ) : (
              <div className="flex flex-col gap-1.5 py-2">
                {api.sharedProjects.map((project) => (
                  <Link
                    key={project.id}
                    href={`/editor/${project.id}`}
                    onClick={onClose}
                    className={cn(
                      "block rounded-lg px-2 py-2 hover:bg-surface/60",
                      activeRoomId === project.id &&
                        "bg-accent-dim ring-1 ring-brand/30"
                    )}
                  >
                    <p className="truncate text-sm font-medium text-copy-primary">
                      {project.name}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </TabsContent>
        </ScrollArea>
        </Tabs>

      <div className="border-t border-surface-border p-4">
        <Button className="w-full" onClick={() => api.openCreate()}>
          <Plus className="h-4 w-4" />
          New Project
        </Button>
      </div>
      </aside>
    </>
  );
}
