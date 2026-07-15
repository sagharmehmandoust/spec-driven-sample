"use client";

import React, { createContext, useContext } from "react";

import { ProjectDialogs } from "@/components/editor/project-dialogs";
import { useProjectActions } from "@/hooks/use-project-actions";

type ProjectDialogsApi = ReturnType<typeof useProjectActions>;

const ProjectDialogsContext = createContext<ProjectDialogsApi | null>(null);

export function useProjectDialogsApi() {
  const api = useContext(ProjectDialogsContext);
  if (!api) {
    throw new Error(
      "useProjectDialogsApi must be used within a ProjectDialogsProvider"
    );
  }
  return api;
}

export function ProjectDialogsProvider({
  children,
  ownedProjects,
  sharedProjects,
}: Readonly<{
  children: React.ReactNode;
  ownedProjects: Array<{ id: string; name: string }>;
  sharedProjects: Array<{ id: string; name: string }>;
}>) {
  const api = useProjectActions({ ownedProjects, sharedProjects });

  return (
    <ProjectDialogsContext.Provider value={api}>
      {children}
      <ProjectDialogs api={api} />
    </ProjectDialogsContext.Provider>
  );
}
