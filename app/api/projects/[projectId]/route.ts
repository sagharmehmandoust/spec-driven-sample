import {
  badRequest,
  forbidden,
  notFound,
  requireUserId,
} from "@/lib/api-auth";
import {
  deleteProject,
  getProjectById,
  renameProject,
} from "@/lib/projects";
import { NextResponse } from "next/server";

interface RenameProjectBody {
  name?: string;
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const userId = await requireUserId();
  if (userId instanceof Response) {
    return userId;
  }

  const { projectId } = await params;
  const project = await getProjectById(projectId);

  if (!project) {
    return notFound();
  }

  if (project.ownerId !== userId) {
    return forbidden();
  }

  let body: RenameProjectBody;

  try {
    body = (await request.json()) as RenameProjectBody;
  } catch {
    return badRequest("Invalid JSON body");
  }

  const name = body.name?.trim();
  if (!name) {
    return badRequest("Project name is required");
  }

  const updatedProject = await renameProject(projectId, name);
  return NextResponse.json(updatedProject);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const userId = await requireUserId();
  if (userId instanceof Response) {
    return userId;
  }

  const { projectId } = await params;
  const project = await getProjectById(projectId);

  if (!project) {
    return notFound();
  }

  if (project.ownerId !== userId) {
    return forbidden();
  }

  await deleteProject(projectId);
  return NextResponse.json({ success: true });
}
