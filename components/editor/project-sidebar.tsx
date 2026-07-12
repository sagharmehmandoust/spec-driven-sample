"use client";

import { FolderOpen, Plus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface ProjectSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

function EmptyProjectsState({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-4 py-12 text-center">
      <FolderOpen className="h-8 w-8 text-copy-faint" />
      <p className="text-sm text-copy-muted">No {label.toLowerCase()} yet</p>
    </div>
  );
}

export function ProjectSidebar({ isOpen, onClose }: ProjectSidebarProps) {
  return (
    <aside
      className={cn(
        "fixed inset-y-3 left-3 z-50 flex w-72 flex-col overflow-hidden rounded-2xl border border-surface-border bg-surface/95 shadow-lg backdrop-blur-sm transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-[calc(100%+1.5rem)]"
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
            <EmptyProjectsState label="My Projects" />
          </TabsContent>
          <TabsContent value="shared" className="mt-0 px-2">
            <EmptyProjectsState label="Shared Projects" />
          </TabsContent>
        </ScrollArea>
      </Tabs>

      <div className="border-t border-surface-border p-4">
        <Button className="w-full">
          <Plus className="h-4 w-4" />
          New Project
        </Button>
      </div>
    </aside>
  );
}
