"use client";

import { useMemo, useState } from "react";
import { usePathname } from "next/navigation";

import { AiSidebarPlaceholder } from "@/components/editor/ai-sidebar-placeholder";
import { EditorNavbar } from "@/components/editor/editor-navbar";
import { ProjectSidebar } from "@/components/editor/project-sidebar";
import { ProjectDialogsProvider } from "@/components/editor/project-dialogs-provider";
import { ShareDialog } from "@/components/editor/share-dialog";
import {
  StarterTemplatesDialogProvider,
  useStarterTemplatesDialog,
} from "@/components/editor/starter-templates-dialog-context";
import { useShareDialog } from "@/hooks/use-share-dialog";

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
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAiSidebarOpen, setIsAiSidebarOpen] = useState(false);

  const activeRoomId = useMemo(() => {
    if (!pathname.startsWith("/editor/")) return null;
    const roomId = pathname.split("/")[2];
    return roomId || null;
  }, [pathname]);

  const activeProject = useMemo(() => {
    if (!activeRoomId) return null;

    const owned = ownedProjects.find((project) => project.id === activeRoomId);
    if (owned) return { ...owned, isOwner: true };

    const shared = sharedProjects.find((project) => project.id === activeRoomId);
    if (shared) return { ...shared, isOwner: false };

    return null;
  }, [activeRoomId, ownedProjects, sharedProjects]);

  const isWorkspace = activeProject !== null;

  const shareDialog = useShareDialog({
    projectId: activeRoomId,
    isOwner: activeProject?.isOwner ?? false,
  });

  return (
    <ProjectDialogsProvider
      ownedProjects={ownedProjects}
      sharedProjects={sharedProjects}
    >
      <StarterTemplatesDialogProvider>
        <EditorShellContent
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          isAiSidebarOpen={isAiSidebarOpen}
          setIsAiSidebarOpen={setIsAiSidebarOpen}
          activeRoomId={activeRoomId}
          activeProject={activeProject}
          isWorkspace={isWorkspace}
          shareDialog={shareDialog}
        >
          {children}
        </EditorShellContent>
      </StarterTemplatesDialogProvider>
    </ProjectDialogsProvider>
  );
}

function EditorShellContent({
  children,
  isSidebarOpen,
  setIsSidebarOpen,
  isAiSidebarOpen,
  setIsAiSidebarOpen,
  activeRoomId,
  activeProject,
  isWorkspace,
  shareDialog,
}: {
  children: React.ReactNode;
  isSidebarOpen: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isAiSidebarOpen: boolean;
  setIsAiSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  activeRoomId: string | null;
  activeProject: { id: string; name: string; isOwner: boolean } | null;
  isWorkspace: boolean;
  shareDialog: ReturnType<typeof useShareDialog>;
}) {
  const templatesDialog = useStarterTemplatesDialog();

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <EditorNavbar
        isSidebarOpen={isSidebarOpen}
        onSidebarToggle={() => setIsSidebarOpen((open) => !open)}
        projectName={activeProject?.name}
        isAiSidebarOpen={isAiSidebarOpen}
        onAiSidebarToggle={() => setIsAiSidebarOpen((open) => !open)}
        onShareClick={shareDialog.openShare}
        onTemplatesClick={isWorkspace ? templatesDialog.openDialog : undefined}
      />
      <ProjectSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        activeRoomId={activeRoomId}
      />
      {isWorkspace ? (
        <AiSidebarPlaceholder
          isOpen={isAiSidebarOpen}
          onClose={() => setIsAiSidebarOpen(false)}
        />
      ) : null}
      <main className="relative min-h-0 flex-1 overflow-hidden">{children}</main>
      {isWorkspace ? (
        <ShareDialog
          api={shareDialog}
          isOwner={activeProject?.isOwner ?? false}
          projectId={activeRoomId}
        />
      ) : null}
    </div>
  );
}
