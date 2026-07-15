import { auth, currentUser } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prisma";

export interface ClerkIdentity {
  userId: string;
  email: string;
}

export async function getCurrentIdentity(): Promise<ClerkIdentity | null> {
  const { userId } = await auth();
  if (!userId) return null;

  const user = await currentUser();
  const email = user?.primaryEmailAddress?.emailAddress ?? "";

  return { userId, email };
}

export function isProjectOwner(
  project: { ownerId: string },
  userId: string
): boolean {
  return project.ownerId === userId;
}

export async function isProjectCollaborator(
  projectId: string,
  email: string
): Promise<boolean> {
  if (!email) return false;

  const collaborator = await prisma.projectCollaborator.findUnique({
    where: {
      projectId_email: {
        projectId,
        email,
      },
    },
  });

  return collaborator !== null;
}

export async function hasProjectAccess(
  project: { id: string; ownerId: string },
  identity: ClerkIdentity
): Promise<boolean> {
  if (isProjectOwner(project, identity.userId)) return true;
  return isProjectCollaborator(project.id, identity.email);
}
