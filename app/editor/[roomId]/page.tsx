import { redirect } from "next/navigation";

import { AccessDenied } from "@/components/editor/access-denied";
import { CanvasPlaceholder } from "@/components/editor/canvas-placeholder";
import {
  getCurrentIdentity,
  hasProjectAccess,
} from "@/lib/project-access";
import { getProjectById } from "@/lib/projects";

interface WorkspacePageProps {
  params: Promise<{ roomId: string }>;
}

export default async function WorkspacePage({ params }: WorkspacePageProps) {
  const { roomId } = await params;
  const identity = await getCurrentIdentity();

  if (!identity) {
    redirect("/sign-in");
  }

  const project = await getProjectById(roomId);

  if (!project || !(await hasProjectAccess(project, identity))) {
    return <AccessDenied />;
  }

  return <CanvasPlaceholder />;
}
