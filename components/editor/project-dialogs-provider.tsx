"use client";

import React, { createContext, useContext } from "react";

import { ProjectDialogs } from "@/components/editor/project-dialogs";
import { useProjectDialogs } from "@/components/editor/use-project-dialogs";

type ProjectDialogsApi = ReturnType<typeof useProjectDialogs>;

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
}: Readonly<{
  children: React.ReactNode;
}>) {
  const api = useProjectDialogs();

  return (
    <ProjectDialogsContext.Provider value={api}>
      {children}
      <ProjectDialogs api={api} />
    </ProjectDialogsContext.Provider>
  );
}

