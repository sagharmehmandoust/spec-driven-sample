import { Prisma } from "@/app/generated/prisma/client";
import {
  badRequest,
  forbidden,
  notFound,
  requireIdentity,
} from "@/lib/api-auth";
import {
  inviteProjectCollaborator,
  listProjectCollaborators,
  removeProjectCollaborator,
} from "@/lib/collaborators";
import { hasProjectAccess, isProjectOwner } from "@/lib/project-access";
import { getProjectById } from "@/lib/projects";
import { NextResponse } from "next/server";

interface InviteCollaboratorBody {
  email?: string;
}

interface RemoveCollaboratorBody {
  email?: string;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const identity = await requireIdentity();
  if (identity instanceof Response) {
    return identity;
  }

  const { projectId } = await params;
  const project = await getProjectById(projectId);

  if (!project) {
    return notFound();
  }

  if (!(await hasProjectAccess(project, identity))) {
    return forbidden();
  }

  const collaborators = await listProjectCollaborators(projectId);

  return NextResponse.json({
    collaborators,
    isOwner: isProjectOwner(project, identity.userId),
  });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const identity = await requireIdentity();
  if (identity instanceof Response) {
    return identity;
  }

  const { projectId } = await params;
  const project = await getProjectById(projectId);

  if (!project) {
    return notFound();
  }

  if (!isProjectOwner(project, identity.userId)) {
    return forbidden();
  }

  let body: InviteCollaboratorBody;

  try {
    body = (await request.json()) as InviteCollaboratorBody;
  } catch {
    return badRequest("Invalid JSON body");
  }

  const email = body.email?.trim();
  if (!email) {
    return badRequest("Email is required");
  }

  try {
    const collaborator = await inviteProjectCollaborator(projectId, email);
    const collaborators = await listProjectCollaborators(projectId);

    return NextResponse.json(
      {
        collaborator: {
          email: collaborator.email,
          createdAt: collaborator.createdAt.toISOString(),
        },
        collaborators,
      },
      { status: 201 }
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to invite collaborator";

    if (message === "Invalid email address") {
      return badRequest(message);
    }

    if (message === "Collaborator already invited") {
      return badRequest(message);
    }

    throw error;
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const identity = await requireIdentity();
  if (identity instanceof Response) {
    return identity;
  }

  const { projectId } = await params;
  const project = await getProjectById(projectId);

  if (!project) {
    return notFound();
  }

  if (!isProjectOwner(project, identity.userId)) {
    return forbidden();
  }

  let body: RemoveCollaboratorBody;

  try {
    body = (await request.json()) as RemoveCollaboratorBody;
  } catch {
    return badRequest("Invalid JSON body");
  }

  const email = body.email?.trim();
  if (!email) {
    return badRequest("Email is required");
  }

  try {
    await removeProjectCollaborator(projectId, email);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return notFound();
    }
    throw error;
  }

  const collaborators = await listProjectCollaborators(projectId);
  return NextResponse.json({ collaborators });
}
