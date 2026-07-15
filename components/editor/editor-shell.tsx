"use client";

import { useState } from "react";

import { EditorNavbar } from "@/components/editor/editor-navbar";
import { ProjectSidebar } from "@/components/editor/project-sidebar";
import { ProjectDialogsProvider } from "@/components/editor/project-dialogs-provider";

interface EditorShellProps {
  children: React.ReactNode;
  ownedProjects: Array<{ id: string; name: string }>;
  sharedProjects: Array<{ id: string; name: string }>;
}

export function EditorShell({
  children,
  ownedProjects,
  sharedProjects,
}: EditorShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <ProjectDialogsProvider
      ownedProjects={ownedProjects}
      sharedProjects={sharedProjects}
    >
      <div className="flex min-h-0 flex-1 flex-col">
        <EditorNavbar
          isSidebarOpen={isSidebarOpen}
          onSidebarToggle={() => setIsSidebarOpen((open) => !open)}
        />
        <ProjectSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
        <main className="relative min-h-0 flex-1">{children}</main>
      </div>
    </ProjectDialogsProvider>
  );
}
